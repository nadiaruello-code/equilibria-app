import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import { createServerSupabaseClient, isAdminEmail } from '@/lib/supabaseServer';
import { createAdminClient } from '@/lib/supabaseAdmin';
import AdminShell from '@/components/AdminShell';
import ChapterEditor from '@/components/ChapterEditor';

async function fallbackChapters() {
  const file = await fs.readFile(path.join(process.cwd(), 'public/data/chapters.json'), 'utf-8');
  return JSON.parse(file);
}

export default async function AdminChaptersPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');
  if (!isAdminEmail(user.email)) redirect('/app');

  const admin = createAdminClient();
  let { data: chapters } = await admin.from('chapters').select('*').order('day');

  if (!chapters || chapters.length === 0) {
    chapters = await fallbackChapters();
  }

  return (
    <AdminShell>
      <h1>Chapitres</h1>
      <p className="muted">Modifie les textes, lieux, symboles et phrases de Lumen.</p>

      {(chapters || []).map((chapter: any) => (
        <ChapterEditor key={chapter.day} chapter={chapter} />
      ))}
    </AdminShell>
  );
}
