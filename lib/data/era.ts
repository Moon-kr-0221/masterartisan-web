import type { HistoryEraGroup, HistoryWorkItem } from './types';

// Decade buckets ending in ...1..0, e.g. 2001–2010 → "2010~2001".
// Admins only enter "year + title (+photos)"; the era grouping is derived here.
export function eraBucket(year: number) {
  const idx = Math.floor((year - 1) / 10);
  const low = idx * 10 + 1;
  const high = idx * 10 + 10;
  return { idx, low, high, label: `${high}~${low}` };
}

// Representative milestone years for the intro clock — evenly spaced across the
// actual data range (oldest → newest). Returns [] when there's nothing to show.
export function milestoneYears(years: number[], count = 8): number[] {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  if (sorted.length <= count) return sorted;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const picks: number[] = [];
  for (let i = 0; i < count; i++) {
    picks.push(Math.round(min + ((max - min) * i) / (count - 1)));
  }
  return [...new Set(picks)];
}

// Group a flat list of history works into era buckets, newest era first.
export function groupByEra(works: HistoryWorkItem[]): HistoryEraGroup[] {
  const byIdx = new Map<number, { label: string; works: HistoryWorkItem[] }>();

  for (const w of works) {
    const { idx, label } = eraBucket(w.year);
    const entry = byIdx.get(idx) ?? { label, works: [] };
    entry.works.push(w);
    byIdx.set(idx, entry);
  }

  return [...byIdx.entries()]
    .sort((a, b) => b[0] - a[0]) // newest decade first
    .map(([, { label, works: ws }]) => ({
      era: label,
      works: ws.sort((a, b) => b.year - a.year),
    }));
}
