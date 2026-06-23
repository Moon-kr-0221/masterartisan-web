import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const IMAGES = [
  'https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1600&q=80',
];

export async function GET() {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  // 어드민 계정으로 로그인
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'rayarchit@naver.com',
    password: 'Ganghwa778!',
  });
  if (authErr || !authData.session) {
    return NextResponse.json({ error: authErr?.message ?? '로그인 실패' }, { status: 401 });
  }

  // 인증된 클라이언트 사용
  supabase.auth.setSession(authData.session);

  // 기존에 이미 있으면 건너뜀
  const { data: existing } = await supabase
    .from('ma_works')
    .select('id')
    .eq('title', '수원화성 동북각루 보수공사')
    .maybeSingle();

  let workId: string;

  if (existing) {
    workId = existing.id;
  } else {
    const { data: work, error: wErr } = await supabase
      .from('ma_works')
      .insert({
        title: '수원화성 동북각루 보수공사',
        category: 'maintenance',
        year: '2024',
        description: '수원화성 동북각루의 전통 목구조 부재 교체 및 단청 보수 작업입니다. 기존 훼손된 서까래와 도리를 소나무 원목으로 교체하고, 전통 방식의 단청을 새로 입혔습니다. 공사 기간 3개월, 문화재청 허가 하에 진행된 정식 문화재 보수 사업입니다.',
        image_url: IMAGES[0],
        sort_order: -1,
      })
      .select('id')
      .single();
    if (wErr || !work) return NextResponse.json({ error: wErr?.message }, { status: 500 });
    workId = work.id;
  }

  // 기존 추가 이미지 제거 후 재삽입
  await supabase.from('ma_work_images').delete().eq('work_id', workId);

  for (let i = 1; i < IMAGES.length; i++) {
    await supabase.from('ma_work_images').insert({
      work_id: workId,
      image_url: IMAGES[i],
      sort_order: i - 1,
    });
  }

  return NextResponse.json({ ok: true, workId, images: IMAGES.length });
}
