import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'rayarchit@naver.com', password: 'Ganghwa778!',
  });
  if (authData.session) supabase.auth.setSession(authData.session);

  const { data: imgs, error } = await supabase
    .from('ma_work_images')
    .select('*')
    .eq('work_id', '11325c9a-d406-4366-bdb4-a8a219ebc856');

  const { data: works, error: wErr } = await supabase
    .from('ma_works')
    .select('id, title, image_url, ma_work_images(image_url, sort_order)')
    .eq('id', '11325c9a-d406-4366-bdb4-a8a219ebc856')
    .single();

  return NextResponse.json({ imgs, imgError: error?.message, works, wErr: wErr?.message });
}
