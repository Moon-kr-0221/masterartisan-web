'use client';

import { ADMIN, SubmitButton } from '@/components/admin/ui';

const SANS = 'var(--font-sans)';

// Generic Excel/CSV bulk-import panel: template download + upload form.
// `action` is a server action passed in from the (server) page.
export default function ImportPanel({
  action, heading, instructions, templateCsv, templateFilename, replaceLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  heading: string;
  instructions: React.ReactNode;
  templateCsv: string;
  templateFilename: string;
  replaceLabel: string;
}) {
  function downloadTemplate() {
    const blob = new Blob([templateCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${ADMIN.hairline}`, padding: 28, marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 300, color: ADMIN.ink }}>
          {heading}
        </p>
        <button type="button" onClick={downloadTemplate}
          style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.04em', color: ADMIN.ink,
            border: `1px solid ${ADMIN.hairline}`, borderRadius: 0, padding: '7px 14px',
            backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
          양식 내려받기 ↓
        </button>
      </div>
      <p style={{ fontFamily: SANS, fontSize: 13, color: '#777', lineHeight: 1.7, marginBottom: 18 }}>
        {instructions}
      </p>

      <form action={action} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <input type="file" name="file" accept=".xlsx,.xls,.csv" required
          style={{ fontFamily: SANS, fontSize: 13, color: ADMIN.inkSoft }} />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: SANS, fontSize: 13, color: ADMIN.inkSoft }}>
          <input type="checkbox" name="replace" />
          {replaceLabel}
        </label>
        <SubmitButton variant="primary">업로드</SubmitButton>
      </form>
    </div>
  );
}
