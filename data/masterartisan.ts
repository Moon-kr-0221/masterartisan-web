// Images mirror the Pencil "MASTERARTISAN" board (Unsplash, 목공/전통건축 테마).
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&q=80`;

export const masterartisanHeroImage = U('photo-1769159828138-a7b3f8540d71');

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
    title: '대목장',
    role: 'Teaching Assistant of Master Artisan',
    description: '경기무형문화재 36호 대목장 전수교육 조교.',
    highlights: ['경기무형문화재 제36호 대목장 전수교육 조교'],
    image: U('photo-1547044479-59ce6c0a784a'),
  },
];
