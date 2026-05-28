export type HistoryWork = {
  year: number | string;
  title: string;
  hasMedia?: boolean;
};

export type HistoryEra = {
  era: string;
  works: HistoryWork[];
};

export const historyEras: HistoryEra[] = [
  {
    era: '~2011',
    works: [
      { year: 2016, title: '광명선원 요사채 工事' },
      { year: 2015, title: '순흥안씨 제실 서고 工事' },
      { year: 2015, title: '순흥안씨 제실 工事' },
      { year: 2015, title: '벌곡 순흥안씨 제실 工事' },
      { year: 2015, title: '구월사 관음전 마루보수공사 工事' },
      { year: 2014, title: '순흥안씨 제실 및 삼문 工事' },
      { year: 2013, title: '순흥안씨 제실 및 삼문 工事' },
      { year: 2012, title: '천안 연기군 임씨제실 및 삼문 工事' },
      { year: 2011, title: '강릉연곡 구월사 대웅전 工事', hasMedia: true },
    ],
  },
  {
    era: '2010~2001',
    works: [
      { year: 2010, title: '파평윤씨 일각문 工事', hasMedia: true },
      { year: 2010, title: '묘적사 화장실 工事' },
      { year: 2009, title: '묘적사 산영각 工事' },
      { year: 2008, title: '대성사 산신각 보수工事' },
      { year: 2007, title: '강릉연곡 구월사 요사처 工事' },
      { year: 2006, title: '이천 산북면 옹기 박물관 보수工事' },
      { year: 2005, title: '논산 가야곡 반야사 법당 工事', hasMedia: true },
      { year: 2004, title: '성북동 성라암 명부전 工事' },
      { year: 2003, title: '성북동 한국가구박물관 工事' },
      { year: 2002, title: '상도동 양녕대군사당 삼문 工事' },
      { year: 2001, title: '벽제 효성 기념관 工事' },
      { year: 2001, title: '적성 봉영사 종각 工事' },
    ],
  },
  {
    era: '2000~1991',
    works: [
      { year: 2000, title: '구월사 관음전 工事', hasMedia: true },
      { year: 2000, title: '가평 대성사 법당 工事', hasMedia: true },
      { year: 2000, title: '광탄 수구암 법당 工事' },
      { year: 1999, title: '원주 보현사 법당 工事' },
      { year: 1999, title: '군포 수지사 법당 工事' },
      { year: 1998, title: '천안 만경사 법당 工事' },
      { year: 1997, title: '수덕사 견승암 工事' },
      { year: 1996, title: '대전 흥룡사 법당 工事' },
      { year: 1995, title: '경주 보문단지 신라촌 129동 工事' },
      { year: 1993, title: '양양 명주사 법당 보수 工事' },
      { year: 1991, title: '봉은사 사내 상가 工事' },
    ],
  },
  {
    era: '1990~1981',
    works: [
      { year: 1990, title: '연안이씨 사당 工事', hasMedia: true },
      { year: 1990, title: '인천 도원동 보각선원 법당 工事' },
      { year: 1987, title: '올림픽공원 팔각정 工事' },
      { year: 1986, title: '수덕사 황하루 工事' },
      { year: 1985, title: '태안 공덕사 법당 工事' },
      { year: 1984, title: '올림픽공원 팔각정 工事', hasMedia: true },
      { year: 1984, title: '송추 오봉산 석굴암 산신각 工事', hasMedia: true },
      { year: 1982, title: '아차산 대성암 법당 工事' },
      { year: 1981, title: '구의동 양천사 법당 工事' },
    ],
  },
  {
    era: '1980~1971',
    works: [
      { year: 1980, title: '중곡동 대순진리회본전 工事' },
      { year: 1979, title: '남양주 오봉산 석굴암 요사처 신축 工事' },
      { year: 1979, title: '구의동 화양사 법당 工事' },
      { year: 1976, title: '태안 흥주사 법당 工事' },
      { year: 1975, title: '인천 보각사 법당 工事' },
      { year: 1974, title: '용문사 주지실 工事' },
      { year: 1974, title: '성북동 성라암 법당신축 工事' },
      { year: 1973, title: '평택 만기사 극락전 工事' },
      { year: 1973, title: '전남 광주 장열사 사당신축 工事' },
      { year: 1972, title: '평택 만기사 법당 工事' },
      { year: 1972, title: '양평 용문사 요사처 신축 工事' },
      { year: 1972, title: '강화 전등사 범종각 신축', hasMedia: true },
      { year: 1972, title: '부여 고란사 종각 신축 工事' },
      { year: 1971, title: '남양주 오봉산 석굴암 법당 신축 工事' },
    ],
  },
  {
    era: '1970~1961',
    works: [
      { year: 1970, title: '안양 망혜암 종각 신축 工事', hasMedia: true },
      { year: 1969, title: '송추 오봉산 석굴암 법당 工事' },
      { year: 1968, title: '진관사 명부전 신축 工事', hasMedia: true },
      { year: 1968, title: '도봉산 망월사 요사처 법당 신축 工事' },
      { year: 1966, title: '영월 사자산법흥사 법당 신축 工事' },
      { year: 1964, title: '경북 김천 직지사 요사처 신축 工事' },
      { year: 1963, title: '낙산사 누각 신축 工事', hasMedia: true },
      { year: 1963, title: '낙산사 홍련암 신축 工事', hasMedia: true },
      { year: 1962, title: '진관동 진관사 요사처 신축 工事' },
      { year: 1962, title: '성북동 녹야원 법당 신축 工事' },
      { year: 1961, title: '서울돈암동 녹야원 법당 工事' },
      { year: 1961, title: '대전 보문산 복전암 요사처 신축 工事' },
    ],
  },
  {
    era: '1960~1951',
    works: [
      { year: 1960, title: '진관동 진관사 법당 신축 工事' },
      { year: 1960, title: '무량사 봉향각 신축 工事', hasMedia: true },
      { year: 1959, title: '양양 낙산사 홍연암 법당 신축 工事' },
      { year: 1958, title: '인천 수봉산 부용암 법당신축 工事' },
      { year: 1958, title: '양양 낙산사 일주문 신축 工事' },
      { year: 1958, title: '대전 보문산 복전암 법당 工事' },
      { year: 1957, title: '강원진부 월정사 법당 신축 工事' },
      { year: 1936, title: '수덕사 대웅전 보수 工事' },
    ],
  },
];
