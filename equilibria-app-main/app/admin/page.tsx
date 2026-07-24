import { redirect } from 'next/navigation';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';
import { createAdminClient } from '@/lib/supabaseAdmin';
import AdminShell from '@/components/AdminShell';

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/app');

  const admin = createAdminClient();

  const { count: usersCount } = await admin.from('profiles').select('*', { count: 'exact', head: true });
  const { count: progressCount } = await admin.from('progress').select('*', { count: 'exact', head: true });

  const { data: profiles } = await admin.from('profiles').select('plan');
  const starter = (profiles || []).filter((p: any) => p.plan === 'starter').length;
  const premium = (profiles || []).filter((p: any) => p.plan === 'premium').length;
  const circle = (profiles || []).filter((p: any) => p.plan === 'circle').length;

  return (
    <AdminShell>
      <h1>Tableau de bord</h1>

      <div className="cards">
        <div className="card"><h2>{usersCount || 0}</h2><p>Utilisateurs</p></div>
        <div className="card"><h2>{progressCount || 0}</h2><p>Progressions sauvegardées</p></div>
        <div className="card"><h2>{premium + circle}</h2><p>Accès complets</p></div>
      </div>

      <div className="card">
        <h2>Plans</h2>
        <p>Découverte : {starter}</p>
        <p>Voyage Complet : {premium}</p>
        <p>Cercle : {circle}</p>
      </div>

      <div className="card">
        <h2>Prochaine étape</h2>
        <p>Ajoute les textes, audios et illustrations depuis l’espace admin.</p>
      </div>
    </AdminShell>
  );
}
