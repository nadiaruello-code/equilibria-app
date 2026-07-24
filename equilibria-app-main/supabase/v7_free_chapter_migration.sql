-- EQUILIBRIA V7 — chapitre 1 gratuit, paiement à partir du chapitre 2
-- À exécuter une seule fois dans Supabase > SQL Editor.

alter table public.profiles drop constraint if exists profiles_plan_check;

alter table public.profiles
  alter column plan set default 'free';

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free','starter','premium','circle'));

-- Les comptes qui n'ont jamais payé doivent passer à "free".
-- IMPORTANT : si certains comptes "starter" ont réellement payé 47 €,
-- ne lancez pas cette ligne pour eux, ou remettez-les ensuite en "starter".
-- update public.profiles set plan = 'free' where plan = 'starter' and stripe_customer_id is null;

create or replace function public.handle_new_user() returns trigger as $$
begin
 insert into public.profiles(id,email,plan)
 values(new.id,new.email,'free')
 on conflict (id) do nothing;
 return new;
end;
$$ language plpgsql security definer;
