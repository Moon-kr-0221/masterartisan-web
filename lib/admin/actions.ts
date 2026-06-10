'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';
import sharp from 'sharp';
import AdmZip from 'adm-zip';

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

// Max dimensions per context (width × height). Always converts to WebP.
const IMAGE_LIMITS: Record<string, { width: number; height: number }> = {
  artisans: { width: 1200, height: 1040 },
  works:    { width: 1600, height: 1200 },
  history:  { width: 1200, height: 900  },
};

// Upload a File from FormData to Storage and return its public URL.
// Resizes to max dimensions and converts to WebP (quality 82) before upload.
// Returns null when no real file was provided.
async function uploadIfPresent(
  supabase: SupabaseClient,
  folder: string,
  file: FormDataEntryValue | null,
): Promise<string | null> {
  if (!file || typeof file === 'string') return null;
  if (file.size === 0) return null;

  const limits = IMAGE_LIMITS[folder] ?? { width: 1600, height: 1200 };
  const raw = Buffer.from(await file.arrayBuffer());
  const processed = await sharp(raw)
    .resize(limits.width, limits.height, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, processed, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'image/webp',
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

// ── Process section images ────────────────────────────────────────────────────
export async function saveHeroSlides(formData: FormData) {
  const supabase = await requireClient();
  for (let i = 1; i <= 4; i++) {
    const file = formData.get(`image_${i}`);
    let imgUrl = String(formData.get(`url_${i}`) ?? '');
    if (file instanceof File && file.size > 0) {
      imgUrl = await uploadIfPresent(supabase, 'hero', file) ?? imgUrl;
    }
    const upserts = [
      { key: `hero_slide_${i}_img`, value: imgUrl },
      { key: `hero_slide_${i}_h1a`, value: String(formData.get(`h1a_${i}`) ?? '') },
      { key: `hero_slide_${i}_h1b`, value: String(formData.get(`h1b_${i}`) ?? '') },
      { key: `hero_slide_${i}_sub`, value: String(formData.get(`sub_${i}`) ?? '') },
    ];
    for (const row of upserts) {
      const { error } = await supabase.from('ma_settings').upsert(row, { onConflict: 'key' });
      if (error) throw new Error(error.message);
    }
  }
  revalidatePath('/');
  revalidatePath('/admin/hero');
}

/** @deprecated use saveHeroSlides */
export async function saveHeroImages(formData: FormData) {
  return saveHeroSlides(formData);
}

export async function savePageHeroImages(formData: FormData) {
  const supabase = await requireClient();
  const entries: [string, string, string][] = [
    ['page_hero_masterartisan', 'image_masterartisan', 'url_masterartisan'],
    ['page_hero_works', 'image_works', 'url_works'],
    ['page_hero_works_mobile', 'image_works_mobile', 'url_works_mobile'],
  ];
  for (const [key, imgField, urlField] of entries) {
    const file = formData.get(imgField);
    let url = String(formData.get(urlField) ?? '');
    if (file instanceof File && file.size > 0) {
      url = await uploadIfPresent(supabase, 'heroes', file) ?? url;
    }
    const { error } = await supabase
      .from('ma_settings')
      .upsert({ key, value: url }, { onConflict: 'key' });
    if (error) throw new Error(error.message);
  }
  revalidatePath('/');
  revalidatePath('/masterartisan');
  revalidatePath('/works');
  revalidatePath('/admin/hero');
}

export async function saveProcessImages(formData: FormData) {
  const supabase = await requireClient();
  for (let i = 1; i <= 4; i++) {
    const key = `process_img_${i}`;
    const file = formData.get(`image_${i}`);
    let url = String(formData.get(`url_${i}`) ?? '');

    if (file instanceof File && file.size > 0) {
      url = await uploadIfPresent(supabase, 'process', file) ?? url;
    }

    const { error } = await supabase
      .from('ma_settings')
      .upsert({ key, value: url }, { onConflict: 'key' });
    if (error) throw new Error(error.message);
  }
  revalidatePath('/');
  revalidatePath('/admin/process');
}

export async function saveContrastImages(formData: FormData) {
  const supabase = await requireClient();
  for (const side of ['left', 'right'] as const) {
    const file = formData.get(`image_${side}`);
    let url = String(formData.get(`url_${side}`) ?? '');
    if (file instanceof File && file.size > 0) {
      url = await uploadIfPresent(supabase, 'contrast', file) ?? url;
    }
    const { error } = await supabase
      .from('ma_settings')
      .upsert({ key: `contrast_${side}_img`, value: url }, { onConflict: 'key' });
    if (error) throw new Error(error.message);
  }
  revalidatePath('/');
  revalidatePath('/admin/hero');
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

// 순서 일괄 저장: FormData에 ids=uuid1,uuid2,... 형태로 전달
export async function reorderWorks(formData: FormData) {
  const supabase = await requireClient();
  const raw = String(formData.get('ids') ?? '');
  if (!raw) return;
  const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
  for (let i = 0; i < ids.length; i++) {
    await supabase.from('ma_works').update({ sort_order: i }).eq('id', ids[i]);
  }
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
  const { data, error } = await supabase.from('ma_history_works').insert({
    year: Number(formData.get('year')),
    title: String(formData.get('title') ?? ''),
    sort_order: Number(formData.get('sort_order') ?? 0),
  }).select('id').single();
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/history');
  return { id: data.id as string };
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
    throw new Error('엑셀, CSV 또는 ZIP 파일을 선택해 주세요.');
  }
  const replace = formData.get('replace') === 'on';

  const buf = Buffer.from(await file.arrayBuffer());
  const isZip = file.name.endsWith('.zip') || (buf[0] === 0x50 && buf[1] === 0x4b);

  // ── ZIP: 엑셀/CSV + 사진 파일들 ──────────────────────────────────────────
  let sheetBuf: ArrayBuffer;
  const imageMap = new Map<string, Buffer>(); // filename → raw buffer

  if (isZip) {
    const zip = new AdmZip(buf);
    let found: ArrayBuffer | null = null;
    for (const entry of zip.getEntries()) {
      const name = entry.entryName.split('/').pop() ?? '';
      if (!name || name.startsWith('.') || entry.isDirectory) continue;
      if (/\.(xlsx|xls|csv)$/.test(name)) {
        found = entry.getData().buffer as ArrayBuffer;
      } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(name)) {
        imageMap.set(name, entry.getData());
        imageMap.set(name.toLowerCase(), entry.getData());
      }
    }
    if (!found) throw new Error('ZIP 안에 엑셀(.xlsx) 또는 CSV 파일이 없습니다.');
    sheetBuf = found;
  } else {
    sheetBuf = buf.buffer as ArrayBuffer;
  }

  const wb = XLSX.read(sheetBuf, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('파일에서 시트를 찾을 수 없습니다.');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, blankrows: false });

  // Detect header row and column positions
  let start = 0;
  let yearCol = 0, titleCol = 1, img1Col = -1, img2Col = -1, img3Col = -1;
  const head = (rows[0] ?? []).map((c) => String(c ?? '').trim());
  const hasHeader = head.some((c) => /연도|year/i.test(c)) || head.some((c) => /제목|title|내용/.test(c));
  if (hasHeader) {
    start = 1;
    const find = (re: RegExp) => head.findIndex((c) => re.test(c));
    const yi = find(/연도|year/i); if (yi >= 0) yearCol = yi;
    const ti = find(/제목|title|내용/i); if (ti >= 0) titleCol = ti;
    img1Col = find(/사진1|photo1|image1/i);
    img2Col = find(/사진2|photo2|image2/i);
    img3Col = find(/사진3|photo3|image3/i);
  }

  const items: { year: number; title: string; sort_order: number; photos: string[] }[] = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i] ?? [];
    const year = parseInt(String(r[yearCol] ?? '').replace(/[^0-9]/g, ''), 10);
    const title = String(r[titleCol] ?? '').trim();
    if (!title || !Number.isFinite(year) || year < 1000 || year > 9999) continue;
    const photos: string[] = [];
    for (const col of [img1Col, img2Col, img3Col]) {
      if (col >= 0) { const v = String(r[col] ?? '').trim(); if (v) photos.push(v); }
    }
    items.push({ year, title, sort_order: i, photos });
  }
  if (items.length === 0) {
    throw new Error('유효한 행이 없습니다. 1열=연도(4자리), 2열=제목 형식인지 확인해 주세요.');
  }

  if (replace) {
    const { error: delErr } = await supabase
      .from('ma_history_works')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (delErr) throw new Error(delErr.message);
  }

  // Insert works and upload photos
  const uploadedUrls = new Map<string, string>();
  for (const item of items) {
    const { data: inserted, error } = await supabase
      .from('ma_history_works')
      .insert({ year: item.year, title: item.title, sort_order: item.sort_order })
      .select('id').single();
    if (error || !inserted) throw new Error(error?.message ?? '연혁 삽입 실패');

    for (let pi = 0; pi < Math.min(item.photos.length, 3); pi++) {
      const filename = item.photos[pi];
      if (!filename) continue;

      // Upload image if not already done
      if (!uploadedUrls.has(filename)) {
        const imgBuf = imageMap.get(filename) ?? imageMap.get(filename.toLowerCase());
        if (!imgBuf) continue;
        const webp = await sharp(imgBuf).resize({ width: 1320, height: 890, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
        const path = `history/${inserted.id}/${Date.now()}_${pi}.webp`;
        const { data: upData, error: upErr } = await supabase.storage.from(BUCKET).upload(path, webp, {
          cacheControl: '3600', upsert: false, contentType: 'image/webp',
        });
        if (upErr) continue;
        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(upData.path);
        uploadedUrls.set(filename, publicUrl);
      }

      await supabase.from('ma_history_media').insert({
        history_work_id: inserted.id, image_url: uploadedUrls.get(filename), sort_order: pi,
      });
    }
  }

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

// ── CSV/Excel 파싱 공통 ────────────────────────────────────────────────────
function parseWorksSheet(buffer: ArrayBuffer) {
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) throw new Error('파일에서 시트를 찾을 수 없습니다.');
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, blankrows: false });

  const head = (rows[0] ?? []).map((c) => String(c ?? '').trim());
  const find = (re: RegExp) => head.findIndex((c) => re.test(c));
  let start = 0;
  let cTitle = 0, cCat = 1, cYear = 2, cDesc = 3, cImg = -1;
  const hasHeader = head.some((c) => /제목|title/i.test(c)) || head.some((c) => /분류|category|구분/i.test(c));
  if (hasHeader) {
    start = 1;
    const t = find(/제목|title/i); if (t >= 0) cTitle = t;
    const c = find(/분류|category|구분/i); if (c >= 0) cCat = c;
    const y = find(/연도|year/i); if (y >= 0) cYear = y;
    const d = find(/설명|description|내용/i); if (d >= 0) cDesc = d;
    cImg = find(/사진파일|이미지파일|파일명|image.?file/i);
  }

  const items: { title: string; category: string; year: string; description: string; imageFilename: string; sort_order: number }[] = [];
  for (let i = start; i < rows.length; i++) {
    const r = rows[i] ?? [];
    const title = String(r[cTitle] ?? '').trim();
    if (!title) continue;
    items.push({
      title,
      category: CATEGORY_MAP[String(r[cCat] ?? '').trim()] ?? 'maintenance',
      year: String(r[cYear] ?? '').trim(),
      description: String(r[cDesc] ?? '').trim(),
      imageFilename: cImg >= 0 ? String(r[cImg] ?? '').trim() : '',
      sort_order: i,
    });
  }
  if (items.length === 0) throw new Error('유효한 행이 없습니다. 1열=제목, 2열=분류, 3열=연도, 4열=설명 형식인지 확인해 주세요.');
  return items;
}

export async function importWorks(formData: FormData) {
  const supabase = await requireClient();
  const file = formData.get('file');
  if (!file || typeof file === 'string' || file.size === 0)
    throw new Error('엑셀, CSV, 또는 ZIP 파일을 선택해 주세요.');
  const replace = formData.get('replace') === 'on';

  const buf = Buffer.from(await file.arrayBuffer());
  const isZip = file.name.endsWith('.zip') || buf[0] === 0x50 && buf[1] === 0x4b;

  // ── ZIP: CSV/Excel + 이미지 파일들 ────────────────────────────────────
  let items: Awaited<ReturnType<typeof parseWorksSheet>>;
  const imageMap = new Map<string, Buffer>(); // filename → raw buffer

  if (isZip) {
    const zip = new AdmZip(buf);
    let sheetBuf: ArrayBuffer | null = null;

    for (const entry of zip.getEntries()) {
      if (entry.isDirectory) continue;
      const name = entry.name.toLowerCase();
      if (/\.(xlsx|xls|csv)$/.test(name)) {
        sheetBuf = entry.getData().buffer as ArrayBuffer;
      } else if (/\.(jpg|jpeg|png|webp)$/.test(name)) {
        imageMap.set(entry.name, entry.getData());
        // also index by lowercase for case-insensitive match
        imageMap.set(name, entry.getData());
      }
    }
    if (!sheetBuf) throw new Error('ZIP 안에 엑셀(.xlsx) 또는 CSV 파일이 없습니다.');
    items = parseWorksSheet(sheetBuf);
  } else {
    items = parseWorksSheet(buf.buffer as ArrayBuffer);
  }

  // ── 이미지 업로드 (ZIP 모드 + 파일명이 있는 경우) ──────────────────────
  const uploadedUrls = new Map<string, string>();
  for (const item of items) {
    if (!item.imageFilename) continue;
    if (uploadedUrls.has(item.imageFilename)) continue;
    const imgBuf = imageMap.get(item.imageFilename) ?? imageMap.get(item.imageFilename.toLowerCase());
    if (!imgBuf) continue;

    const processed = await sharp(imgBuf)
      .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const path = `works/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, processed, {
      cacheControl: '3600', upsert: false, contentType: 'image/webp',
    });
    if (upErr) throw new Error(`이미지 업로드 실패 (${item.imageFilename}): ${upErr.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    uploadedUrls.set(item.imageFilename, data.publicUrl);
  }

  const dbItems = items.map((item) => ({
    title: item.title,
    category: item.category,
    year: item.year,
    description: item.description,
    image_url: uploadedUrls.get(item.imageFilename) ?? '',
    sort_order: item.sort_order,
  }));

  if (replace) {
    const { error: delErr } = await supabase.from('ma_works').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (delErr) throw new Error(delErr.message);
  }

  const { error } = await supabase.from('ma_works').insert(dbItems);
  if (error) throw new Error(error.message);

  revalidatePublic();
  revalidatePath('/admin/works');
}

// ── Contact Info ───────────────────────────────────────────────────────────

export async function saveContact(formData: FormData) {
  const supabase = await requireClient();

  const payload = {
    phone:         String(formData.get('phone')         ?? ''),
    fax:           String(formData.get('fax')           ?? ''),
    email:         String(formData.get('email')         ?? ''),
    hours:         String(formData.get('hours')         ?? ''),
    office_name:   String(formData.get('office_name')   ?? ''),
    address:       String(formData.get('address')       ?? ''),
    naver_map_url: String(formData.get('naver_map_url') ?? ''),
    cert_title:    String(formData.get('cert_title')    ?? ''),
    cert_desc:     String(formData.get('cert_desc')     ?? ''),
  };

  // Upsert single-row settings (id = 1)
  const { error } = await supabase
    .from('ma_contact')
    .upsert({ id: 1, ...payload }, { onConflict: 'id' });

  if (error) throw new Error(error.message);

  revalidatePath('/contact');
  revalidatePath('/admin/contact');
}

// ── Work 추가 이미지 ───────────────────────────────────────────────────────

export async function addWorkImage(formData: FormData) {
  const supabase = await requireClient();
  const workId = String(formData.get('work_id') ?? '');
  const file = formData.get('image') as File | null;
  if (!file || !file.size || !workId) throw new Error('파일 또는 작업 ID가 없습니다.');

  const buf = Buffer.from(await file.arrayBuffer());
  const processed = await sharp(buf)
    .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const path = `works/${workId}/${Date.now()}.webp`;
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, processed, {
    cacheControl: '3600', upsert: false, contentType: 'image/webp',
  });
  if (upErr) throw new Error(upErr.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  // sort_order: 기존 최대값 + 1
  const { data: existing } = await supabase
    .from('ma_work_images').select('sort_order').eq('work_id', workId).order('sort_order', { ascending: false }).limit(1);
  const nextOrder = ((existing?.[0]?.sort_order ?? -1) as number) + 1;

  const { error } = await supabase.from('ma_work_images').insert({
    work_id: Number(workId), image_url: data.publicUrl, sort_order: nextOrder,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/works');
  revalidatePath('/admin/works');
}

export async function deleteWorkImage(formData: FormData) {
  const supabase = await requireClient();
  const imageUrl = String(formData.get('image_url') ?? '');
  const workId   = String(formData.get('work_id')   ?? '');
  if (!imageUrl || !workId) throw new Error('이미지 URL 또는 작업 ID가 없습니다.');

  // Storage에서 파일 삭제
  const match = imageUrl.match(/ma-images\/(.+)$/);
  if (match) await supabase.storage.from(BUCKET).remove([match[1]]);

  // DB에서 행 삭제
  const { error } = await supabase.from('ma_work_images')
    .delete()
    .eq('work_id', Number(workId))
    .eq('image_url', imageUrl);
  if (error) throw new Error(error.message);

  revalidatePath('/works');
  revalidatePath('/admin/works');
}
