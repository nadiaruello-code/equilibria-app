import { redirect } from 'next/navigation';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';
import AdminShell from '@/components/AdminShell';
import IllustrationUploader from '@/components/IllustrationUploader';

export default async function AdminIllustrationsPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/app');

  return (
    <AdminShell>
      <h1>Illustrations</h1>
      <p className="muted">Ajoute les visuels des 42 lieux.</p>
      <IllustrationUploader />
    </AdminShell>
  );
}
