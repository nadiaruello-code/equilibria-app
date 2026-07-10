import { redirect } from 'next/navigation';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';
import AudioUploader from '@/components/AudioUploader';

export default async function UploadAudioPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/app');

  return <main className="section"><div className="container">
    <div className="card"><h1>Audios Equilibria</h1><p className="muted">Ajoute ou remplace les audios des chapitres.</p></div>
    <AudioUploader />
  </div></main>;
}
