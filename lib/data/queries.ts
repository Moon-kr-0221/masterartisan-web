import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { masterartisanData } from '@/data/masterartisan';
import { worksData, categoryLabels } from '@/data/works';
import { historyEras } from '@/data/history';
import { groupByEra } from './era';
import type {
  Artisan,
  ContactInfo,
  FeaturedWork,
  HistoryEraGroup,
  HistoryWorkItem,
  Work,
  WorkCategory,
} from './types';

// All three getters fall back to the static data/*.ts content whenever Supabase
// is not configured or a query fails — the public site never breaks.

// ── Artisans (master artisan generations) ──────────────────────────────────
const artisanFallback: Artisan[] = masterartisanData.map((a) => ({
  generation: a.generation,
  generationEn: a.generationEn,
  name: a.name,
  title: a.title,
  role: a.role,
  description: a.description,
  highlights: a.highlights,
  image: a.image,
}));

export async function getArtisans(): Promise<Artisan[]> {
  if (!isSupabaseConfigured) return artisanFallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_artisans')
      .select('*')
      .order('generation', { ascending: true });
    if (error || !data || data.length === 0) return artisanFallback;
    return data.map((a) => ({
      generation: a.generation,
      generationEn: a.generation_en ?? '',
      name: a.name ?? '',
      title: a.title ?? '',
      role: a.role ?? '',
      description: a.description ?? '',
      highlights: Array.isArray(a.highlights) ? a.highlights : [],
      image: a.image_url ?? '',
    }));
  } catch {
    return artisanFallback;
  }
}

// ── Works ───────────────────────────────────────────────────────────────────
const worksFallback: Work[] = worksData.map((w) => ({
  id: String(w.id),
  title: w.title,
  category: w.category,
  year: w.year,
  description: w.description,
  image: w.image,
  images: w.image ? [w.image] : [],
  featured: false,
  featuredOrder: 0,
}));

export async function getWorks(): Promise<Work[]> {
  if (!isSupabaseConfigured) return worksFallback;
  try {
    const supabase = await createClient();

    // 1차: 추가 이미지 join 시도
    const { data, error } = await supabase
      .from('ma_works')
      .select('*, ma_work_images(image_url, sort_order)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    // ma_work_images 테이블 없으면 join 없이 재시도
    const rows = (error || !data)
      ? await supabase
          .from('ma_works')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })
          .then((r) => r.data ?? [])
      : data;

    if (!rows || rows.length === 0) return worksFallback;

    return rows.map((w) => {
      const main = w.image_url ?? '';
      const extra: string[] = ((w.ma_work_images ?? []) as { image_url: string; sort_order: number }[])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => i.image_url);
      const images = main ? [main, ...extra] : extra;
      return {
        id: String(w.id),
        title: w.title ?? '',
        category: (w.category ?? 'maintenance') as WorkCategory,
        year: w.year ?? '',
        description: w.description ?? '',
        image: main,
        images,
        featured: Boolean(w.featured),
        featuredOrder: Number(w.featured_order ?? 0),
      };
    });
  } catch {
    return worksFallback;
  }
}

const toFeatured = (w: {
  title?: string; category?: string; year?: string; image_url?: string;
}): FeaturedWork => ({
  title: w.title ?? '',
  cat: categoryLabels[(w.category ?? 'maintenance') as WorkCategory] ?? '',
  year: w.year ?? '',
  bg: w.image_url ?? '',
  color: '#1E1B16',
});

// Whether the home "작업 사례" showcase should pick works at random (admin toggle).
export async function getHomeWorksRandom(): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_settings').select('value').eq('key', 'home_works_random').maybeSingle();
    return !error && data?.value === 'true';
  } catch {
    return false;
  }
}

// Home showcase data: the random flag, the admin-pinned works, and the full pool
// (so the client can shuffle when random mode is on). Empty → home uses its default.
export async function getHomeFeatured(): Promise<{
  random: boolean; pinned: FeaturedWork[]; pool: FeaturedWork[];
}> {
  const empty = { random: false, pinned: [], pool: [] };
  if (!isSupabaseConfigured) return empty;
  try {
    const supabase = await createClient();
    const { data: works, error } = await supabase
      .from('ma_works')
      .select('title, category, year, image_url, featured, featured_order');
    if (error || !works) return empty;

    const pool = works.map(toFeatured);
    const pinned = works
      .filter((w) => w.featured)
      .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0))
      .slice(0, 3)
      .map(toFeatured);

    // ma_settings may not exist yet (before migration) — read defensively.
    let random = false;
    const { data: setting, error: sErr } = await supabase
      .from('ma_settings').select('value').eq('key', 'home_works_random').maybeSingle();
    if (!sErr) random = setting?.value === 'true';

    return { random, pinned, pool };
  } catch {
    return empty;
  }
}

// ── Process section images ────────────────────────────────────────────────────
export type HeroSlide = { image: string; h1a: string; h1b: string; sub: string };

const HERO_SLIDE_KEYS = [1, 2, 3, 4].flatMap((n) =>
  [`hero_slide_${n}_img`, `hero_slide_${n}_h1a`, `hero_slide_${n}_h1b`, `hero_slide_${n}_sub`]
);

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const empty: HeroSlide[] = Array.from({ length: 4 }, () => ({ image: '', h1a: '', h1b: '', sub: '' }));
  if (!isSupabaseConfigured) return empty;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('ma_settings').select('key, value').in('key', HERO_SLIDE_KEYS);
    if (error || !data) return empty;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return [1, 2, 3, 4].map((n) => ({
      image: map[`hero_slide_${n}_img`] ?? '',
      h1a:   map[`hero_slide_${n}_h1a`] ?? '',
      h1b:   map[`hero_slide_${n}_h1b`] ?? '',
      sub:   map[`hero_slide_${n}_sub`]  ?? '',
    }));
  } catch {
    return empty;
  }
}

/** @deprecated use getHeroSlides */
export async function getHeroImages(): Promise<string[]> {
  const slides = await getHeroSlides();
  return slides.map((s) => s.image);
}

export async function getPageHeroImages(): Promise<{ masterartisan: string; works: string; worksMobile: string }> {
  const fallback = { masterartisan: '', works: '', worksMobile: '' };
  if (!isSupabaseConfigured) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_settings')
      .select('key, value')
      .in('key', ['page_hero_masterartisan', 'page_hero_works', 'page_hero_works_mobile']);
    if (error || !data) return fallback;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return {
      masterartisan: map['page_hero_masterartisan'] ?? '',
      works: map['page_hero_works'] ?? '',
      worksMobile: map['page_hero_works_mobile'] ?? '',
    };
  } catch {
    return fallback;
  }
}

export async function getProcessImages(): Promise<string[]> {
  if (!isSupabaseConfigured) return ['', '', '', ''];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_settings')
      .select('key, value')
      .in('key', ['process_img_1', 'process_img_2', 'process_img_3', 'process_img_4']);
    if (error || !data) return ['', '', '', ''];
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return [
      map['process_img_1'] ?? '',
      map['process_img_2'] ?? '',
      map['process_img_3'] ?? '',
      map['process_img_4'] ?? '',
    ];
  } catch {
    return ['', '', '', ''];
  }
}

export async function getContrastImages(): Promise<{ left: string; right: string }> {
  const fallback = { left: '', right: '' };
  if (!isSupabaseConfigured) return fallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_settings')
      .select('key, value')
      .in('key', ['contrast_left_img', 'contrast_right_img']);
    if (error || !data) return fallback;
    const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
    return {
      left:  map['contrast_left_img']  ?? '',
      right: map['contrast_right_img'] ?? '',
    };
  } catch {
    return fallback;
  }
}

// ── History (eras derived from year) ─────────────────────────────────────────
const historyFallback: HistoryEraGroup[] = historyEras.map((era) => ({
  era: era.era,
  works: era.works.map((w, i) => ({
    id: `${era.era}-${i}`,
    year: Number(w.year),
    title: w.title,
    hasMedia: Boolean(w.hasMedia || (w.media && w.media.length > 0)),
    media: w.media ?? [],
  })),
}));

export async function getHistory(): Promise<HistoryEraGroup[]> {
  if (!isSupabaseConfigured) return historyFallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_history_works')
      .select('id, year, title, sort_order, ma_history_media(image_url, caption, sort_order)')
      .order('year', { ascending: false });
    if (error || !data || data.length === 0) return historyFallback;

    const flat: HistoryWorkItem[] = data.map((w) => {
      const media = (w.ma_history_media ?? [])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((m) => ({ image_url: m.image_url, caption: m.caption ?? null }));
      return {
        id: String(w.id),
        year: Number(w.year),
        title: w.title ?? '',
        hasMedia: media.length > 0,
        media,
      };
    });
    return groupByEra(flat);
  } catch {
    return historyFallback;
  }
}

// Flat history list (newest year first) for the admin editor.
export async function getHistoryWorksFlat(): Promise<HistoryWorkItem[]> {
  const fallbackFlat: HistoryWorkItem[] = historyFallback
    .flatMap((e) => e.works)
    .sort((a, b) => b.year - a.year);

  if (!isSupabaseConfigured) return fallbackFlat;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_history_works')
      .select('id, year, title, sort_order, ma_history_media(id, image_url, caption, sort_order)')
      .order('year', { ascending: false });
    if (error || !data) return fallbackFlat;
    return data.map((w) => {
      const media = (w.ma_history_media ?? [])
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((m) => ({ id: String(m.id), image_url: m.image_url, caption: m.caption ?? null }));
      return {
        id: String(w.id),
        year: Number(w.year),
        title: w.title ?? '',
        hasMedia: media.length > 0,
        media,
      };
    });
  } catch {
    return fallbackFlat;
  }
}

// ── Contact Info ───────────────────────────────────────────────────────────

const contactFallback: ContactInfo = {
  phone: '070-7715-4704',
  fax: '0504-230-4704',
  email: 'rayarchit@naver.com',
  hours: '평일 09:00 – 18:00\n토요일 09:00 – 13:00 (일·공휴일 휴무)',
  office_name: '고려문화재기술원(주)',
  address: '인천광역시 강화군 송해면 강화대로 778',
  naver_map_url: 'https://naver.me/xtNhmH4G',
  cert_title: '경기무형문화재 제36호',
  cert_desc: '전통건축 유지보수·수리·제작에 관한 모든 문의를 환영합니다.\n방문 전 사전 연락을 부탁드립니다.',
};

export async function getContact(): Promise<ContactInfo> {
  if (!isSupabaseConfigured) return contactFallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_contact')
      .select('*')
      .single();
    if (error || !data) return contactFallback;
    return {
      phone:         data.phone         ?? contactFallback.phone,
      fax:           data.fax           ?? contactFallback.fax,
      email:         data.email         ?? contactFallback.email,
      hours:         data.hours         ?? contactFallback.hours,
      office_name:   data.office_name   ?? contactFallback.office_name,
      address:       data.address       ?? contactFallback.address,
      naver_map_url: data.naver_map_url ?? contactFallback.naver_map_url,
      cert_title:    data.cert_title    ?? contactFallback.cert_title,
      cert_desc:     data.cert_desc     ?? contactFallback.cert_desc,
    };
  } catch {
    return contactFallback;
  }
}
