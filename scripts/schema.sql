-- Run this in the Supabase SQL editor at https://supabase.com/dashboard

create table professions (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text not null,
  traits           jsonb not null default '{}',
  description      text not null,
  why              text not null,
  status           text not null default 'active',
  submission_count int not null default 1,
  created_at       timestamptz default now()
);

create table profession_submissions (
  id                      uuid primary key default gen_random_uuid(),
  suggested_name          text not null,
  traits                  jsonb not null default '{}',
  submitted_by_session    text not null,
  created_at              timestamptz default now()
);

-- RLS
alter table professions             enable row level security;
alter table profession_submissions  enable row level security;

create policy "Public read active professions"
  on professions for select using (status = 'active');

create policy "Public insert submissions"
  on profession_submissions for insert with check (true);
