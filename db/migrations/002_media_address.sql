-- Uploaded cover photographs (resized in the browser to <= ~1.5 MB). Stored in Postgres for now;
-- move to object storage (same /media/:id URL) when volume justifies it.
create table media (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  mime text not null check (mime in ('image/jpeg','image/webp','image/png')),
  bytes int not null check (bytes between 1 and 2500000),
  data bytea not null,
  created_at timestamptz not null default now()
);
create index on media(wedding_id);

alter table wedding_events add column address text not null default '';
