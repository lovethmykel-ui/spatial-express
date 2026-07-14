-- Curated airdrop campaigns, maintained by the site owner
create table if not exists airdrops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  chain text not null,
  effort text not null check (effort in ('low', 'medium', 'high')),
  description text,
  link text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Tasks belonging to each airdrop campaign
create table if not exists airdrop_tasks (
  id uuid primary key default gen_random_uuid(),
  airdrop_id uuid not null references airdrops(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);

-- Per-user progress, keyed by an anonymous device/browser id (no login required)
create table if not exists airdrop_progress (
  id uuid primary key default gen_random_uuid(),
  anon_id text not null,
  task_id uuid not null references airdrop_tasks(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (anon_id, task_id)
);

alter table airdrops enable row level security;
alter table airdrop_tasks enable row level security;
alter table airdrop_progress enable row level security;

-- Anyone can read active campaigns and tasks
create policy "public read airdrops" on airdrops
  for select using (active = true);

create policy "public read airdrop_tasks" on airdrop_tasks
  for select using (true);

-- Anyone can manage their own progress rows (scoped by anon_id from the client)
create policy "public manage own progress" on airdrop_progress
  for all using (true) with check (true);
