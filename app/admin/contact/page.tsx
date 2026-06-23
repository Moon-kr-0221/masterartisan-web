import { getContact } from '@/lib/data/queries';
import ContactForm from './ContactForm';

const SERIF = 'var(--font-serif)';
const SANS  = 'var(--font-sans)';

export default async function AdminContactPage() {
  const contact = await getContact();
  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: '#1A1A1A', marginBottom: 8 }}>
        연락처 정보
      </h1>
      <p style={{ fontFamily: SANS, fontSize: 14, color: '#777', marginBottom: 36, lineHeight: 1.7 }}>
        Contact 페이지에 표시되는 전화·이메일·주소·운영시간 등을 수정합니다.
      </p>
      <ContactForm contact={contact} />
    </div>
  );
}
