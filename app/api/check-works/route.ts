import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('ma_works')
    .select('id, title, image_url, ma_work_images(image_url, sort_order)')
    .order('sort_order', { ascending: true })
    .limit(5);

  return NextResponse.json({ count: data?.length, error: error?.message, sample: data?.[0] });
}
