-- Wedsent core schema (R1/R2). Tenant key is wedding_id on every wedding-owned row.

create table users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_digest text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table weddings (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references users(id) on delete cascade,
  slug text unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 3 and 48),
  state text not null default 'draft' check (state in ('draft','published','archived')),
  published_version_id uuid,
  timezone text not null default 'Europe/London',
  rsvp_deadline timestamptz,
  allow_changes_after_deadline boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on weddings(owner_user_id);

-- One mutable draft row per wedding (rev = optimistic concurrency); published rows are immutable snapshots.
create table design_versions (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  state text not null check (state in ('draft','published')),
  version int not null,
  rev int not null default 1,
  content jsonb not null,
  created_at timestamptz not null default now(),
  unique (wedding_id, version)
);
create unique index one_draft_per_wedding on design_versions(wedding_id) where state = 'draft';
alter table weddings add constraint weddings_published_fk foreign key (published_version_id) references design_versions(id);

create table wedding_events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  title text not null check (length(title) between 1 and 80),
  starts_on date,
  starts_at_local time,
  venue text not null default '',
  city text not null default '',
  visibility text not null default 'invited' check (visibility in ('invited','everyone')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (wedding_id, id)
);

create table households (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  display_name text not null check (length(display_name) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (wedding_id, id)
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null,
  household_id uuid not null,
  display_name text not null check (length(display_name) between 1 and 120),
  email text,
  is_child boolean not null default false,
  created_at timestamptz not null default now(),
  foreign key (wedding_id, household_id) references households(wedding_id, id) on delete cascade,
  unique (wedding_id, id)
);
create index on guests(household_id);

-- Access unit for a household. Not a person and not a headcount.
create table invitations (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null,
  household_id uuid not null,
  token_digest text not null unique,
  token_enc text not null,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  last_opened_at timestamptz,
  foreign key (wedding_id, household_id) references households(wedding_id, id) on delete cascade
);
create unique index one_active_invitation on invitations(household_id) where revoked_at is null;

create table event_invitees (
  wedding_id uuid not null,
  event_id uuid not null,
  guest_id uuid not null,
  primary key (event_id, guest_id),
  foreign key (wedding_id, event_id) references wedding_events(wedding_id, id) on delete cascade,
  foreign key (wedding_id, guest_id) references guests(wedding_id, id) on delete cascade
);

-- At most one current answer per person per event. "No row" means no reply (not declined).
create table event_responses (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null,
  event_id uuid not null,
  guest_id uuid not null,
  status text not null check (status in ('attending','declined')),
  note text check (note is null or length(note) <= 240),
  version int not null default 1,
  source text not null check (source in ('guest','host')),
  responded_at timestamptz not null default now(),
  unique (event_id, guest_id),
  foreign key (event_id, guest_id) references event_invitees(event_id, guest_id) on delete cascade
);

create table response_history (
  id bigserial primary key,
  wedding_id uuid not null,
  event_id uuid not null,
  guest_id uuid not null,
  status text not null,
  note text,
  source text not null,
  version int not null,
  changed_at timestamptz not null default now()
);
create index on response_history(wedding_id, guest_id);

create table audit_events (
  id bigserial primary key,
  wedding_id uuid,
  actor_kind text not null check (actor_kind in ('owner','guest','system','operator')),
  actor_id text,
  action text not null,
  target_kind text,
  target_id text,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index on audit_events(wedding_id, created_at);

create table idempotency_keys (
  scope text not null,
  key text not null,
  response jsonb not null,
  created_at timestamptz not null default now(),
  primary key (scope, key)
);

create table rate_limits (
  key text primary key,
  count int not null,
  window_start timestamptz not null
);

-- Publish entitlement (filled by a verified payment webhook once D01 is decided).
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  kind text not null check (kind in ('publish')),
  source text not null,
  external_id text,
  created_at timestamptz not null default now(),
  unique (source, external_id)
);
