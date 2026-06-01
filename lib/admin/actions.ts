'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const BUCKET = 'ma-images';

// Every mutation runs through this — Server Functions are reachable via direct
// POST, so we re-verify auth here (not just in middleware).
async function requireClient(): Promise<SupabaseClient> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  return supabase;
}

function revalidatePublic() {
  revalidatePath('/masterartisan');
  revalidatePath('/works');
  revalidatePath('/history');
}

// Upload a File from FormData to Storage and return its public URL.
// Returns null when no real file was provided.
async function uploadIfPresent(
  supabase: SupabaseClient,
  folder: string,
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!file || typeof file === 'string') return null;
  if (file.size === 0) return null;

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ── Artisans ────────────────────────────────────────────────────────────────
export async function updateArtisan(formData: FormData) {
  const supabase = await requireClient();
  const generation = Number(formData.get('generation'));
  const newImage = await uploadIfPresent(supabase, 'artisans', formData.get('image'));

  const update: Record<string, unknown> = {
    generation_en: String(formData.get('generation_en') ?? ''),
    name: String(formData.get('name') ?? ''),
    title: String(formData.get('title') ?? ''),
    role: String(formData.get('role') ?? ''),
    description: String(formData.get('description') ?? ''),
    updated_at: new Date().toISOString(),
  };
  if (newImage) update.image_url = newImage;

  const { error } = await supabase.from('ma_artisans').update(update).eq('generation', generation);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/artisans');
}

// ── Works ─────────────────────────────────────────────────────────────────
export async function createWork(formData: FormData) {
  const supabase = await requireClient();
  const image = await uploadIfPresent(supabase, 'works', formData.get('image'));

  const { error } = await supabase.from('ma_works').insert({
    title: String(formData.get('title') ?? ''),
    category: String(formData.get('category') ?? 'maintenance'),
    year: String(formData.get('year') ?? ''),
    description: String(formData.get('description') ?? ''),
    image_url: image ?? '',
    sort_order: Number(formData.get('sort_order') ?? 0),
    featured: formData.get('featured') === 'on',
    featured_order: Number(formData.get('featured_order') ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}

export async function updateWork(formData: FormData) {
  const supabase = await requireClient();
  const id = String(formData.get('id'));
  const newImage = await uploadIfPresent(supabase, 'works', formData.get('image'));

  const update: Record<string, unknown> = {
    title: String(formData.get('title') ?? ''),
    category: String(formData.get('category') ?? 'maintenance'),
    year: String(formData.get('year') ?? ''),
    description: String(formData.get('description') ?? ''),
    sort_order: Number(formData.get('sort_order') ?? 0),
    featured: formData.get('featured') === 'on',
    featured_order: Number(formData.get('featured_order') ?? 0),
    updated_at: new Date().toISOString(),
  };
  if (newImage) update.image_url = newImage;

  const { error } = await supabase.from('ma_works').update(update).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}

export async function deleteWork(formData: FormData) {
  const supabase = await requireClient();
  const id = String(formData.get('id'));
  const { error } = await supabase.from('ma_works').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}

// ── Site settings ───────────────────────────────────────────────────────────
export async function setHomeWorksRandom(formData: FormData) {
  const supabase = await requireClient();
  const value = formData.get('random') === 'on' ? 'true' : 'false';
  const { error } = await supabase
    .from('ma_settings')
    .upsert({ key: 'home_works_random', value }, { onConflict: 'key' });
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}

// ── History works ───────────────────────────────────────────────────────────
export async function createHistoryWork(formData: FormData) {
  const supabase = await requireClient();
  const { error } = await supabase.from('ma_history_works').insert({
    year: Number(formData.get('year')),
    title: String(formData.get('title') ?? ''),
    sort_order: Number(formData.get('sort_order') ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

export async function updateHistoryWork(formData: FormData) {
  const supabase = await requireClient();
  const id = String(formData.get('id'));
  const { error } = await supabase.from('ma_history_works').update({
    year: Number(formData.get('year')),
    title: String(formData.get('title') ?? ''),
  }).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

export async function deleteHistoryWork(formData: FormData) {
  const supabase = await requireClient();
  const id = String(formData.get('id'));
  // ma_history_media rows cascade-delete via FK.
  const { error } = await supabase.from('ma_history_works').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

// ── History media (photos attached to a history work) ────────────────────────
export async function addHistoryMedia(formData: FormData) {
  const supabase = await requireClient();
  const historyWorkId = String(formData.get('history_work_id'));
  const image = await uploadIfPresent(supabase, 'history', formData.get('image'));
  if (!image) throw new Error('사진 파일을 선택해 주세요.');

  const { error } = await supabase.from('ma_history_media').insert({
    history_work_id: historyWorkId,
    image_url: image,
    caption: String(formData.get('caption') ?? '') || null,
    sort_order: Number(formData.get('sort_order') ?? 0),
  });
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

export async function deleteHistoryMedia(formData: FormData) {
  const supabase = await requireClient();
  const id = String(formData.get('id'));
  const { error } = await supabase.from('ma_history_media').delete().eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

// ── Bulk import history from an Excel/CSV file ───────────────────────────────
// Expected columns: 연도(year, 4 digits) | 제목(title). A header row is optional.
export async function importHistory(formData: FormData) {
  const supabase = await requireClient();
  const file = formData.get('file');
  if (!file || typeof file === 'string' || file.size === 0) {
    throw new Error('엑셀 또는 CSV 파일을 선택해 주세요.');
  }
  const replace = formData.get('replace') === 'on';

  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('파일에서 시트를 찾을 수 없습니다.');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, blankrows: false });

  // Detect an optional header row and which columns hold year / title.
  let start = 0;
  let yearCol = 0;
  let titleCol = 1;
  const head = (rows[0] ?? []).map((c) => String(c ?? '').trim());
  const hasHeader = head.some((c) => /연도|year/i.test(c)) || head.some((c) => /제목|title|내용/.test(c));
  if (hasHeader) {
    start = 1;
    const yi = head.findIndex((c) => /연도|year/i.test(c));
    const ti = head.findIndex((c) => /제목|title|내용/.test(c));
    if (yi >= 0) yearCol = yi;
    if (ti >= 0) titleCol = ti;
  }

  const items: { year: number; title: string; sort_order: number }[] = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i] ?? [];
    const year = parseInt(String(r[yearCol] ?? '').replace(/[^0-9]/g, ''), 10);
    const title = String(r[titleCol] ?? '').trim();
    if (!title || !Number.isFinite(year) || year < 1000 || year > 9999) continue;
    items.push({ year, title, sort_order: i });
  }
  if (items.length === 0) {
    throw new Error('유효한 행이 없습니다. 1열=연도(4자리), 2열=제목 형식인지 확인해 주세요.');
  }

  if (replace) {
    const { error: delErr } = await supabase
      .from('ma_history_works')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // matches all rows
    if (delErr) throw new Error(delErr.message);
  }

  const { error } = await supabase.from('ma_history_works').insert(items);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
}

// ── Bulk import works from an Excel/CSV file ─────────────────────────────────
// Columns: 제목(title) | 분류(category) | 연도(year) | 설명(description) | 사진URL(optional).
// Category accepts Korean labels (유지보수/수리/제작/도면) or English slugs.
const CATEGORY_MAP: Record<string, string> = {
  '유지보수': 'maintenance', '수리': 'repair', '제작': 'fabrication', '도면': 'drawing',
  maintenance: 'maintenance', repair: 'repair', fabrication: 'fabrication', drawing: 'drawing',
};

export async function importWorks(formData: FormData) {
  const supabase = await requireClient();
  const file = formData.get('file');
  if (!file || typeof file === 'string' || file.size === 0) {
    throw new Error('엑셀 또는 CSV 파일을 선택해 주세요.');
  }
  const replace = formData.get('replace') === 'on';

  const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('파일에서 시트를 찾을 수 없습니다.');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, blankrows: false });

  const head = (rows[0] ?? []).map((c) => String(c ?? '').trim());
  const find = (re: RegExp) => head.findIndex((c) => re.test(c));
  let start = 0;
  let cTitle = 0, cCat = 1, cYear = 2, cDesc = 3, cImg = 4;
  let hasImgCol = true;
  const hasHeader = head.some((c) => /제목|title/i.test(c)) || head.some((c) => /분류|category|구분/i.test(c));
  if (hasHeader) {
    start = 1;
    const t = find(/제목|title/i); if (t >= 0) cTitle = t;
    const c = find(/분류|category|구분/i); if (c >= 0) cCat = c;
    const y = find(/연도|year/i); if (y >= 0) cYear = y;
    const d = find(/설명|description|내용/i); if (d >= 0) cDesc = d;
    const im = find(/사진|이미지|image|url/i); cImg = im; hasImgCol = im >= 0;
  }

  const items = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i] ?? [];
    const title = String(r[cTitle] ?? '').trim();
    if (!title) continue;
    const rawCat = String(r[cCat] ?? '').trim();
    items.push({
      title,
      category: CATEGORY_MAP[rawCat] ?? 'maintenance',
      year: String(r[cYear] ?? '').trim(),
      description: String(r[cDesc] ?? '').trim(),
      image_url: hasImgCol ? String(r[cImg] ?? '').trim() : '',
      sort_order: i,
    });
  }
  if (items.length === 0) {
    throw new Error('유효한 행이 없습니다. 1열=제목, 2열=분류, 3열=연도, 4열=설명 형식인지 확인해 주세요.');
  }

  if (replace) {
    const { error: delErr } = await supabase
      .from('ma_works')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (delErr) throw new Error(delErr.message);
  }

  const { error } = await supabase.from('ma_works').insert(items);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}
