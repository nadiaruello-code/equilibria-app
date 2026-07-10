create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 email text unique,
 plan text not null default 'starter' check (plan in ('starter','premium','circle')),
 stripe_customer_id text,
 created_at timestamptz default now()
);
create table if not exists public.progress (
 id bigint generated always as identity primary key,
 user_id uuid references auth.users(id) on delete cascade,
 chapter_day int,
 completed boolean default false,
 journal text,
 updated_at timestamptz default now(),
 unique(user_id, chapter_day)
);
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
create policy profiles_select_own on public.profiles for select using (auth.uid() = id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = id);
create policy progress_select_own on public.progress for select using (auth.uid() = user_id);
create policy progress_insert_own on public.progress for insert with check (auth.uid() = user_id);
create policy progress_update_own on public.progress for update using (auth.uid() = user_id);
create or replace function public.handle_new_user() returns trigger as $$
begin
 insert into public.profiles(id,email,plan) values(new.id,new.email,'starter') on conflict (id) do nothing;
 return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
