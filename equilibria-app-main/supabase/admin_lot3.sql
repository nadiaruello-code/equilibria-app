-- Lot 3 : tables et colonnes administration

create table if not exists public.chapters (
  day int primary key,
  title text not null,
  place text,
  symbol text,
  emoji text,
  quote text,
  text_content text,
  audio_path text,
  illustration_path text,
  created_at timestamptz default now()
);

alter table public.chapters enable row level security;

drop policy if exists chapters_read_authenticated on public.chapters;
create policy chapters_read_authenticated on public.chapters
for select to authenticated using (true);

alter table public.chapters add column if not exists illustration_path text;

insert into public.chapters(day,title,place,symbol,emoji,quote,audio_path,illustration_path)
select
  i,
  'Chapitre ' || i,
  'Lieu Equilibria',
  'Symbole Lumen',
  '✦',
  'Je reviens à moi, un souffle après l’autre.',
  'jour-' || i || '.m4a',
  'jour-' || i || '.webp'
from generate_series(1,42) as i
on conflict (day) do nothing;
