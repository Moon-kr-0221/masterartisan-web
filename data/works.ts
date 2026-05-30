export type WorkCategory = 'all' | 'maintenance' | 'repair' | 'fabrication';

// Images mirror the Pencil "WORKS" board (Unsplash, 전통건축 테마).
const U = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1080&q=80`;

export const worksData = [
  {
    id: 1,
    title: '수원 사찰 대웅전 보수',
    category: 'maintenance' as WorkCategory,
    year: '2022',
    description: '전통 목구조 대웅전의 지붕 및 기둥 보수 공사.',
    image: U('photo-1759662802641-1748a95ade41'),
  },
  {
    id: 2,
    title: '용인 전통 가옥 수리',
    category: 'repair' as WorkCategory,
    year: '2021',
    description: '조선시대 전통 한옥 기와 및 목구조 전면 수리.',
    image: U('photo-1512059555341-6a121e7d4d86'),
  },
  {
    id: 3,
    title: '전통 문짝 제작',
    category: 'fabrication' as WorkCategory,
    year: '2023',
    description: '전통 소나무 목재를 이용한 사찰 법당 문짝 제작.',
    image: U('photo-1542722578-f2971981d74f'),
  },
  {
    id: 4,
    title: '경기도 향교 기와 보수',
    category: 'maintenance' as WorkCategory,
    year: '2022',
    description: '조선시대 향교 건물 기와 전면 교체 및 보수.',
    image: U('photo-1765570710985-fe9e17af1b6c'),
  },
  {
    id: 5,
    title: '전통 누각 복원',
    category: 'repair' as WorkCategory,
    year: '2020',
    description: '화재로 소실된 전통 누각의 원형 복원 작업.',
    image: U('photo-1584264415558-6580a2bf40a0'),
  },
  {
    id: 6,
    title: '전통 창호 제작',
    category: 'fabrication' as WorkCategory,
    year: '2023',
    description: '전통 한지와 목재를 사용한 격자창호 주문 제작.',
    image: U('photo-1621083377566-7ba9edc11ae6'),
  },
  {
    id: 7,
    title: '남한산성 문루 보수',
    category: 'maintenance' as WorkCategory,
    year: '2021',
    description: '남한산성 내 조선시대 문루 목구조 부재 교체 및 단청 보수.',
    image: U('photo-1565073624497-7144969d4a9d'),
  },
  {
    id: 8,
    title: '전통 소반 제작',
    category: 'fabrication' as WorkCategory,
    year: '2022',
    description: '전통 나주소반 형식의 주문 제작. 느티나무 원목 사용.',
    image: U('photo-1558618666-fcd25c85cd64'),
  },
  {
    id: 9,
    title: '화성 행궁 별당 수리',
    category: 'repair' as WorkCategory,
    year: '2023',
    description: '화성 행궁 부속 별당 지붕 및 대들보 균열 보수 공사.',
    image: U('photo-1519581706030-bf476f0f5eb0'),
  },
];

export const categoryLabels: Record<WorkCategory, string> = {
  all: '전체',
  maintenance: '유지보수',
  repair: '수리',
  fabrication: '제작',
};
