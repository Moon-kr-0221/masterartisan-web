import ScrollReveal from './ScrollReveal';

interface SectionTitleProps {
  en: string;
  kr: string;
  description?: string;
  centered?: boolean;
}

export default function SectionTitle({ en, kr, description, centered = false }: SectionTitleProps) {
  return (
    <ScrollReveal>
      <div className={centered ? 'text-center' : ''}>
        <p
          className="text-sm tracking-[0.3em] uppercase mb-3"
          style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-en-serif)' }}
        >
          {en}
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: 'var(--color-timber-100)', fontFamily: 'var(--font-kr-serif)' }}
        >
          {kr}
        </h2>
        <div
          className={`w-16 h-px mb-8 ${centered ? 'mx-auto' : ''}`}
          style={{ backgroundColor: 'var(--color-timber-400)' }}
        />
        {description && (
          <p
            className="text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}