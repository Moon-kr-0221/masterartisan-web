import { masterartisanData } from '../data/masterartisan.ts';
import { worksData } from '../data/works.ts';
import { historyEras } from '../data/history.ts';

const q = (s: string | number | null | undefined) =>
  s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`;

const lines: string[] = [];

lines.push('-- ── Seed: ma_artisans ──');
lines.push('insert into ma_artisans (generation, generation_en, name, title, role, description, image_url, highlights, sort_order) values');
lines.push(
  masterartisanData
    .map(
      (a) =>
        `  (${a.generation}, ${q(a.generationEn)}, ${q(a.name)}, ${q(a.title)}, ${q(a.role)}, ${q(a.description)}, ${q(a.image)}, ${q(JSON.stringify(a.highlights))}::jsonb, ${a.generation})`,
    )
    .join(',\n') + '\non conflict (generation) do nothing;',
);
lines.push('');

lines.push('-- ── Seed: ma_works ──');
lines.push('insert into ma_works (title, category, year, description, image_url, sort_order) values');
lines.push(
  worksData
    .map(
      (w, i) =>
        `  (${q(w.title)}, ${q(w.category)}, ${q(w.year)}, ${q(w.description)}, ${q(w.image)}, ${i})`,
    )
    .join(',\n') + ';',
);
lines.push('');

lines.push('-- ── Seed: ma_history_works ──');
const rows: string[] = [];
let order = 0;
for (const era of historyEras) {
  for (const w of era.works) {
    rows.push(`  (${Number(w.year)}, ${q(w.title)}, ${order++})`);
  }
}
lines.push('insert into ma_history_works (year, title, sort_order) values');
lines.push(rows.join(',\n') + ';');

console.log(lines.join('\n'));
