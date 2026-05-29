create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_slug text not null,
  score_pct smallint not null check (score_pct >= 0 and score_pct <= 100),
  correct smallint not null check (correct >= 0),
  total smallint not null check (total > 0),
  passed boolean not null default false,
  completed_at timestamptz not null default now(),
  unique (user_id, quiz_slug)
);

create index if not exists quiz_results_user_id_idx on public.quiz_results (user_id);

alter table public.quiz_results enable row level security;

create policy "quiz_results_select_own"
  on public.quiz_results
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "quiz_results_insert_own"
  on public.quiz_results
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "quiz_results_update_own"
  on public.quiz_results
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
