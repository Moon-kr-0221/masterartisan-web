// Images mirror the Pencil "MASTERARTISAN" board (Unsplash, 목공/전통건축 테마).
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&q=80`;

// 펜슬 Jsfk8 / x6H3v — 전통 한옥 내부 목조 기둥·창살 (데스크탑+모바일 동일)
export const masterartisanHeroImage = U('photo-1651238150402-234ab80bb5bb');
export const masterartisanHeroImageMobile = U('photo-1651238150402-234ab80bb5bb');

export const masterartisanData = [
  {
    generation: 1,
    generationKr: '초대',
    generationEn: '1st Generation',
    name: '故장조웅',
    title: '대목장',
    role: 'The founder of Jangga Woodworks',
    description: '목공소 장가의 창립자로 전통 목구조 건축의 기초를 닦았다.',
    highlights: [],
    image: U('photo-1560846389-956694677531'),
  },
  {
    generation: 2,
    generationKr: '이대',
    generationEn: '2nd Generation',
    name: '장효순',
    title: '대목장',
    role: 'Master Artisan of Wood Architecture',
    description: '경기무형문화재 36호 대목장 보유자.',
    highlights: ['경기무형문화재 제36호 대목장 보유자'],
    image: U('photo-1683115097279-415af7be0209'),
  },
  {
    generation: 3,
    generationKr: '삼대',
    generationEn: '3rd Generation',
    name: '장원희',
    title: '대표 · 대목장 전승교육사',
    role: 'Founder & Heritage Repair Technician',
    description: '국가유산 수리기술자(보수) 제1748호 · 수리기능자(대목수) 제014157호. 경기도 무형유산 대목장 전승교육사로서 회사를 설립해 전통건축의 맥을 잇는다.',
    highlights: [
      '국가유산 수리기술자(보수) 제1748호',
      '국가유산 수리기능자(대목수) 제014157호',
      '경기도 무형유산 대목장 전승교육사',
    ],
    image: U('photo-1547044479-59ce6c0a784a'),
  },
];
