-- Owner-uploaded invitation background music. For launch, move binary data to object storage.
create table music_assets (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  mime text not null check (mime = 'audio/mpeg'),
  bytes int not null check (bytes between 1 and 8000000),
  data bytea not null,
  rights_confirmed_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index on music_assets(wedding_id);
