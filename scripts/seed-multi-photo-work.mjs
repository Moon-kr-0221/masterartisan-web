// 다중 사진 테스트용 작업사례 1건 삽입
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oizjcdtnlbqehbgoyyyr.supabase.co';
const ANON_KEY     = 'sb_publishable_zaS1vhs9KDHDeMxkVMCGwg_0sscVBQR';

const supabase = createClient(SUPABASE_URL, ANON_KEY);

// 전통건축 관련 공개 이미지 (Unsplash)
const IMAGES = [
  'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1600&q=80',
];

async function main() {
  // 1. 작업사례 삽입
  const { data: work, error: wErr } = await supabase
    .from('ma_works')
    .insert({
      title: '수원화성 동북각루 보수공사',
      category: 'maintenance',
      year: '2024',
      description:
        '수원화성 동북각루의 전통 목구조 부재 교체 및 단청 보수 작업입니다. ' +
        '기존 훼손된 서까래와 도리를 소나무 원목으로 교체하고, 전통 방식의 단청을 새로 입혔습니다. ' +
        '공사 기간 3개월, 문화재청 허가 하에 진행된 정식 문화재 보수 사업입니다.',
      image_url: IMAGES[0],
      sort_order: -1,
    })
    .select('id')
    .single();

  if (wErr || !work) { console.error('작업 삽입 실패:', wErr); process.exit(1); }
  console.log('작업 삽입 완료 id:', work.id);

  // 2. 추가 이미지 삽입
  for (let i = 1; i < IMAGES.length; i++) {
    const { error } = await supabase.from('ma_work_images').insert({
      work_id: work.id,
      image_url: IMAGES[i],
      sort_order: i - 1,
    });
    if (error) console.error(`이미지 ${i} 삽입 실패:`, error);
    else console.log(`이미지 ${i} 삽입 완료`);
  }

  console.log('\n완료! /works 페이지에서 확인하세요.');
}

main();
