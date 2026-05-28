export type WorkCategory = 'all' | 'maintenance' | 'repair' | 'fabrication';

export const worksData = [
  {
    id: 1,
    title: '수원 사찰 대웅전 보수',
    category: 'maintenance' as WorkCategory,
    year: '2022',
    description: '전통 목구조 대웅전의 지붕 및 기둥 보수 공사.',
    image: '/images/works/work-01.jpg',
  },
  {
    id: 2,
    title: '용인 전통 가옥 수리',
    category: 'repair' as WorkCategory,
    year: '2021',
    description: '조선시대 전통 한옥 기와 및 목구조 전면 수리.',
    image: '/images/works/work-02.jpg',
  },
  {
    id: 3,
    title: '전통 문짝 제작',
    category: 'fabrication' as WorkCategory,
    year: '2023',
    description: '전통 소나무 목재를 이용한 사찰 법당 문짝 제작.',
    image: '/images/works/work-03.jpg',
  },
  {
    id: 4,
    title: '경기도 향교 기와 보수',
    category: 'maintenance' as WorkCategory,
    year: '2022',
    description: '조선시대 향교 건물 기와 전면 교체 및 보수.',
    image: '/images/works/work-04.jpg',
  },
  {
    id: 5,
    title: '전통 누각 복원',
    category: 'repair' as WorkCategory,
    year: '2020',
    description: '화재로 소실된 전통 누각의 원형 복원 작업.',
    image: '/images/works/work-05.jpg',
  },
  {
    id: 6,
    title: '전통 창호 제작',
    category: 'fabrication' as WorkCategory,
    year: '2023',
    description: '전통 한지와 목재를 사용한 격자창호 주문 제작.',
    image: '/images/works/work-06.jpg',
  },
];

export const categoryLabels: Record<WorkCategory, string> = {
  all: '전체',
  maintenance: '유지보수',
  repair: '수리',
  fabrication: '제작',
};