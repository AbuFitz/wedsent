-- Wedsent operational foundations. All access is through authenticated server routes.
-- This schema is deliberately not granted to anon/authenticated PostgREST roles.

create table wedding_staff (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  email text not null check (email = lower(email)),
  display_name text not null check (length(display_name) between 1 and 120),
  role text not null check (role in ('manager','scanner','viewer')),
  state text not null default 'invited' check (state in ('invited','active','suspended')),
  invite_digest text unique,
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  disabled_at timestamptz,
  unique(wedding_id, email),
  unique(wedding_id, id)
);
create index wedding_staff_wedding_state_idx on wedding_staff(wedding_id, state);

create table admission_passes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  household_id uuid not null,
  event_id uuid not null,
  token_digest text not null unique,
  issued_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  label text not null default '',
  foreign key(wedding_id, household_id) references households(wedding_id,id) on delete cascade,
  foreign key(wedding_id, event_id) references wedding_events(wedding_id,id) on delete cascade,
  unique(wedding_id, event_id, household_id, id),
  unique(wedding_id, id)
);
create index admission_passes_lookup_idx on admission_passes(wedding_id, event_id) where revoked_at is null;

-- One row per admitted person and event. A household with five guests may arrive 3 + 2.
-- The unique event/guest key is the concurrency boundary for simultaneous scans.
create table guest_checkins (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null,
  event_id uuid not null,
  guest_id uuid not null,
  pass_id uuid,
  staff_id uuid,
  checked_in_at timestamptz not null default now(),
  method text not null check (method in ('qr','lookup','owner')),
  unique(event_id, guest_id),
  foreign key(event_id, guest_id) references event_invitees(event_id,guest_id) on delete cascade,
  foreign key(wedding_id, pass_id) references admission_passes(wedding_id,id),
  foreign key(wedding_id, staff_id) references wedding_staff(wedding_id,id)
);
create index guest_checkins_wedding_event_idx on guest_checkins(wedding_id,event_id,checked_in_at desc);

create table checkin_attempts (
  id bigserial primary key,
  wedding_id uuid not null references weddings(id) on delete cascade,
  event_id uuid references wedding_events(id) on delete set null,
  pass_id uuid,
  staff_id uuid,
  outcome text not null check (outcome in ('admitted','duplicate','invalid','revoked','not_eligible','manual_override')),
  guest_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  foreign key(wedding_id, pass_id) references admission_passes(wedding_id,id),
  foreign key(wedding_id, staff_id) references wedding_staff(wedding_id,id)
);
create index checkin_attempts_wedding_time_idx on checkin_attempts(wedding_id, created_at desc);

create table message_deliveries (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  household_id uuid,
  channel text not null check (channel in ('email','whatsapp')),
  category text not null check (category in ('invitation','confirmation','reminder','update')),
  recipient text not null,
  state text not null default 'queued' check (state in ('queued','sending','sent','delivered','failed','cancelled')),
  provider text,
  provider_message_id text,
  attempts int not null default 0 check (attempts >= 0),
  last_error text,
  scheduled_for timestamptz,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key(wedding_id,household_id) references households(wedding_id,id) on delete set null (household_id)
);
create index message_deliveries_queue_idx on message_deliveries(state, scheduled_for) where state in ('queued','failed');
create index message_deliveries_wedding_idx on message_deliveries(wedding_id,created_at desc);
create unique index message_deliveries_provider_id_idx on message_deliveries(provider,provider_message_id) where provider_message_id is not null;

create table wedding_orders (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  package text not null check (package in ('essential','plus','premium','enterprise')),
  capacity int not null check (capacity > 0),
  amount_pence int not null check (amount_pence >= 0),
  currency text not null default 'gbp' check (currency = 'gbp'),
  state text not null default 'pending' check (state in ('pending','paid','refunded','partially_refunded','cancelled')),
  provider text,
  provider_checkout_id text,
  provider_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index wedding_orders_checkout_idx on wedding_orders(provider,provider_checkout_id) where provider_checkout_id is not null;
create unique index wedding_orders_payment_idx on wedding_orders(provider,provider_payment_id) where provider_payment_id is not null;

create table provider_webhook_events (
  provider text not null,
  external_event_id text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  status text not null default 'received' check (status in ('received','processed','failed')),
  primary key(provider,external_event_id)
);

do $$ declare item record; begin
  for item in select unnest(array['wedding_staff','admission_passes','guest_checkins','checkin_attempts','message_deliveries','wedding_orders','provider_webhook_events']) as name loop
    execute format('alter table public.%I enable row level security', item.name);
    -- Supabase provides these roles; embedded PGlite used by tests does not.
    if exists (select 1 from pg_roles where rolname = 'anon') then
      execute format('revoke all on public.%I from anon', item.name);
    end if;
    if exists (select 1 from pg_roles where rolname = 'authenticated') then
      execute format('revoke all on public.%I from authenticated', item.name);
    end if;
  end loop;
end $$;
