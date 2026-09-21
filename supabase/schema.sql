create table if not exists public.published_episodes (
  id text primary key,
  payload jsonb not null,
  published_at timestamptz not null default now()
);
create table if not exists public.published_quotes (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  published_at timestamptz not null default now()
);
create table if not exists public.published_media (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('image', 'video')),
  url text not null,
  thumbnail_url text,
  description text,
  published_at timestamptz not null default now()
);
insert into storage.buckets (id, name, public)
values ('wits-media', 'wits-media', true)
on conflict (id) do update set public = true;
alter table public.published_episodes enable row level security;
alter table public.published_quotes enable row level security;
alter table public.published_media enable row level security;
create policy "Published episodes are public" on public.published_episodes for select using (true);
create policy "Published quotes are public" on public.published_quotes for select using (true);
create policy "Published media are public" on public.published_media for select using (true);
create policy "Admins manage episodes" on public.published_episodes for all to authenticated using (true) with check (true);
create policy "Admins manage quotes" on public.published_quotes for all to authenticated using (true) with check (true);
create policy "Admins manage media" on public.published_media for all to authenticated using (true) with check (true);
create policy "Public media files are viewable" on storage.objects for select using (bucket_id = 'wits-media');
create policy "Admins upload media files" on storage.objects for insert to authenticated with check (bucket_id = 'wits-media');
create policy "Admins update media files" on storage.objects for update to authenticated using (bucket_id = 'wits-media') with check (bucket_id = 'wits-media');
create policy "Admins delete media files" on storage.objects for delete to authenticated using (bucket_id = 'wits-media');
