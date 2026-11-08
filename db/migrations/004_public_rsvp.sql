-- Public-link RSVPs are unverified declarations, separate from invited guests.
-- A public-link submission can never grant admission or event-specific permissions.
create table public_rsvps (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  event_id uuid,
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) between 3 and 254),
  status text not null check (status in ('attending','declined')),
  note text check (note is null or length(note) <= 240),
  created_at timestamptz not null default now(),
  foreign key (wedding_id, event_id) references wedding_events(wedding_id, id) on delete cascade
);
create index public_rsvps_wedding on public_rsvps(wedding_id, created_at desc);
