import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { masterartisanData } from '@/data/masterartisan';
import { worksData, categoryLabels } from '@/data/works';
import { historyEras } from '@/data/history';
import { groupByEra } from './era';
import type {
  Artisan,
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
  featured: false,
  featuredOrder: 0,
}));

export async function getWorks(): Promise<Work[]> {
  if (!isSupabaseConfigured) return worksFallback;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('ma_works')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (error || !data || data.length === 0) return worksFallback;
    return data.map((w) => ({
      id: String(w.id),
      title: w.title ?? '',
      category: (w.category ?? 'maintenance') as WorkCategory,
      year: w.year ?? '',
      description: w.description ?? '',
      image: w.image_url ?? '',
      featured: Boolean(w.featured),
      featuredOrder: Number(w.featured_order ?? 0),
    }));
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

// ── History (eras derived from year) ─────────────────────────────────────────
const historyFallback: HistoryEraGroup[] = historyEras.map((era) => ({
  era: era.era,
  works: era.works.map((w, i) => ({
    id: `${era.era}-${i}`,
    year: Number(w.year),
    title: w.title,
    hasMedia: Boolean(w.hasMedia),
    media: [],
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
