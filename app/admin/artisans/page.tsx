import { getArtisans } from '@/lib/data/queries';
import { updateArtisan } from '@/lib/admin/actions';
import { TextField, TextArea, ImageInput, SubmitButton } from '@/components/admin/ui';

const SERIF = 'var(--font-serif)';
const SANS = 'var(--font-sans)';
const HAIR = '#E4E0D8';

const genKr = ['', '초대', '이대', '삼대'];

export default async function AdminArtisansPage() {
  const artisans = await getArtisans();

  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        장인 소개
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        각 대(代) 장인의 사진과 소개 내용을 수정합니다.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {artisans.map((a) => (
          <form key={a.generation} action={updateArtisan}
            style={{ backgroundColor: '#FFFFFF', border: `1px solid ${HAIR}`, padding: 28 }}>
            <input type="hidden" name="generation" value={a.generation} />

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 300, color: '#1A1A1A' }}>
                {genKr[a.generation] ?? `${a.generation}대`} 장인
              </span>
              <span style={{ fontFamily: SANS, fontSize: 11, letterSpacing: '0.1em', color: '#AAA' }}>
                {a.generationEn}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ImageInput current={a.image} hint="권장 1200 × 1040px · 최소 600 × 520px (가로형 · JPG/PNG · 5MB 이하)" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <TextField label="이름" name="name" defaultValue={a.name} required />
                <TextField label="직함" name="title" defaultValue={a.title} placeholder="대목장" />
              </div>
              <TextField label="영문 세대 표기" name="generation_en" defaultValue={a.generationEn} placeholder="1st Generation" />
              <TextField label="역할 (영문 부제)" name="role" defaultValue={a.role} placeholder="The founder of Jangga Woodworks" />
              <TextArea label="소개 내용" name="description" defaultValue={a.description} />
            </div>

            <div style={{ marginTop: 20 }}>
              <SubmitButton>저장</SubmitButton>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
