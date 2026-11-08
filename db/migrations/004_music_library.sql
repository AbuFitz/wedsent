alter table music_assets drop constraint if exists music_assets_bytes_check;
alter table music_assets add constraint music_assets_bytes_check check (bytes between 1 and 12000000);
alter table music_assets add column if not exists title varchar(100) not null default 'Uploaded recording';
