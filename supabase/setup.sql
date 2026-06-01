-- ============================================================
-- MasterArtisan CMS — Supabase 초기 설정 (SQL Editor에 전체 붙여넣고 Run, 한 번만)
-- 다시 실행해도 안전하도록 작성됨.
-- ============================================================

-- 1) 테이블 ----------------------------------------------------
create table if not exists ma_artisans (
  id uuid primary key default gen_random_uuid(),
  generation int unique not null,
  generation_en text,
  name text,
  title text,
  role text,
  description text,
  image_url text,
  highlights jsonb default '[]'::jsonb,
  sort_order int default 0,
  updated_at timestamptz default now()
);

create table if not exists ma_works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'maintenance'
    check (category in ('maintenance','repair','fabrication','drawing')),
  year text,
  description text,
  image_url text,
  sort_order int default 0,
  featured boolean not null default false,
  featured_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ma_history_works (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists ma_history_media (
  id uuid primary key default gen_random_uuid(),
  history_work_id uuid not null references ma_history_works(id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index if not exists idx_history_media_work on ma_history_media(history_work_id);

create table if not exists ma_settings (
  key text primary key,
  value text not null default ''
);

-- 2) RLS (행 수준 보안) ----------------------------------------
alter table ma_artisans       enable row level security;
alter table ma_works          enable row level security;
alter table ma_history_works  enable row level security;
alter table ma_history_media  enable row level security;
alter table ma_settings       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['ma_artisans','ma_works','ma_history_works','ma_history_media','ma_settings'] loop
    execute format('drop policy if exists "public read %1$s" on %1$s', t);
    execute format('drop policy if exists "auth write %1$s" on %1$s', t);
    execute format('create policy "public read %1$s" on %1$s for select using (true)', t);
    execute format('create policy "auth write %1$s" on %1$s for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- 3) Storage (사진 저장소) -------------------------------------
insert into storage.buckets (id, name, public) values ('ma-images', 'ma-images', true)
on conflict (id) do nothing;

drop policy if exists "ma-images public read"  on storage.objects;
drop policy if exists "ma-images auth insert"  on storage.objects;
drop policy if exists "ma-images auth update"  on storage.objects;
drop policy if exists "ma-images auth delete"  on storage.objects;
create policy "ma-images public read" on storage.objects
  for select using (bucket_id = 'ma-images');
create policy "ma-images auth insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'ma-images');
create policy "ma-images auth update" on storage.objects
  for update to authenticated using (bucket_id = 'ma-images');
create policy "ma-images auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'ma-images');

-- 4) 시드 데이터 (기존 사이트 내용 그대로) ---------------------
insert into ma_settings (key, value) values ('home_works_random', 'false')
on conflict (key) do nothing;

-- ── Seed: ma_artisans ──
insert into ma_artisans (generation, generation_en, name, title, role, description, image_url, highlights, sort_order) values
  (1, '1st Generation', '故장조웅', '대목장', 'The founder of Jangga Woodworks', '목공소 장가의 창립자로 전통 목구조 건축의 기초를 닦았다.', 'https://images.unsplash.com/photo-1560846389-956694677531?auto=format&fit=crop&w=1080&q=80', '[]'::jsonb, 1),
  (2, '2nd Generation', '장효순', '대목장', 'Master Artisan of Wood Architecture', '경기무형문화재 36호 대목장 보유자.', 'https://images.unsplash.com/photo-1683115097279-415af7be0209?auto=format&fit=crop&w=1080&q=80', '["경기무형문화재 제36호 대목장 보유자"]'::jsonb, 2),
  (3, '3rd Generation', '장원희', '대목장', 'Teaching Assistant of Master Artisan', '경기무형문화재 36호 대목장 전수교육 조교.', 'https://images.unsplash.com/photo-1547044479-59ce6c0a784a?auto=format&fit=crop&w=1080&q=80', '["경기무형문화재 제36호 대목장 전수교육 조교"]'::jsonb, 3)
on conflict (generation) do nothing;

-- ── Seed: ma_works ── (테이블이 비어있을 때만 — 재실행해도 중복 안 됨)
insert into ma_works (title, category, year, description, image_url, sort_order)
select * from (values
  ('수원 사찰 대웅전 보수', 'maintenance', '2022', '전통 목구조 대웅전의 지붕 및 기둥 보수 공사.', 'https://images.unsplash.com/photo-1759662802641-1748a95ade41?auto=format&fit=crop&w=1080&q=80', 0),
  ('용인 전통 가옥 수리', 'repair', '2021', '조선시대 전통 한옥 기와 및 목구조 전면 수리.', 'https://images.unsplash.com/photo-1512059555341-6a121e7d4d86?auto=format&fit=crop&w=1080&q=80', 1),
  ('전통 문짝 제작', 'fabrication', '2023', '전통 소나무 목재를 이용한 사찰 법당 문짝 제작.', 'https://images.unsplash.com/photo-1542722578-f2971981d74f?auto=format&fit=crop&w=1080&q=80', 2),
  ('경기도 향교 기와 보수', 'maintenance', '2022', '조선시대 향교 건물 기와 전면 교체 및 보수.', 'https://images.unsplash.com/photo-1765570710985-fe9e17af1b6c?auto=format&fit=crop&w=1080&q=80', 3),
  ('전통 누각 복원', 'repair', '2020', '화재로 소실된 전통 누각의 원형 복원 작업.', 'https://images.unsplash.com/photo-1584264415558-6580a2bf40a0?auto=format&fit=crop&w=1080&q=80', 4),
  ('전통 창호 제작', 'fabrication', '2023', '전통 한지와 목재를 사용한 격자창호 주문 제작.', 'https://images.unsplash.com/photo-1621083377566-7ba9edc11ae6?auto=format&fit=crop&w=1080&q=80', 5),
  ('남한산성 문루 보수', 'maintenance', '2021', '남한산성 내 조선시대 문루 목구조 부재 교체 및 단청 보수.', 'https://images.unsplash.com/photo-1565073624497-7144969d4a9d?auto=format&fit=crop&w=1080&q=80', 6),
  ('전통 소반 제작', 'fabrication', '2022', '전통 나주소반 형식의 주문 제작. 느티나무 원목 사용.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1080&q=80', 7),
  ('화성 행궁 별당 수리', 'repair', '2023', '화성 행궁 부속 별당 지붕 및 대들보 균열 보수 공사.', 'https://images.unsplash.com/photo-1519581706030-bf476f0f5eb0?auto=format&fit=crop&w=1080&q=80', 8)
) as v(title, category, year, description, image_url, sort_order)
where not exists (select 1 from ma_works);

-- ── Seed: ma_history_works ── (테이블이 비어있을 때만 — 재실행해도 중복 안 됨)
insert into ma_history_works (year, title, sort_order)
select * from (values
  (2016, '광명선원 요사채 工事', 0),
  (2015, '순흥안씨 제실 서고 工事', 1),
  (2015, '순흥안씨 제실 工事', 2),
  (2015, '벌곡 순흥안씨 제실 工事', 3),
  (2015, '구월사 관음전 마루보수공사 工事', 4),
  (2014, '순흥안씨 제실 및 삼문 工事', 5),
  (2013, '순흥안씨 제실 및 삼문 工事', 6),
  (2012, '천안 연기군 임씨제실 및 삼문 工事', 7),
  (2011, '강릉연곡 구월사 대웅전 工事', 8),
  (2010, '파평윤씨 일각문 工事', 9),
  (2010, '묘적사 화장실 工事', 10),
  (2009, '묘적사 산영각 工事', 11),
  (2008, '대성사 산신각 보수工事', 12),
  (2007, '강릉연곡 구월사 요사처 工事', 13),
  (2006, '이천 산북면 옹기 박물관 보수工事', 14),
  (2005, '논산 가야곡 반야사 법당 工事', 15),
  (2004, '성북동 성라암 명부전 工事', 16),
  (2003, '성북동 한국가구박물관 工事', 17),
  (2002, '상도동 양녕대군사당 삼문 工事', 18),
  (2001, '벽제 효성 기념관 工事', 19),
  (2001, '적성 봉영사 종각 工事', 20),
  (2000, '구월사 관음전 工事', 21),
  (2000, '가평 대성사 법당 工事', 22),
  (2000, '광탄 수구암 법당 工事', 23),
  (1999, '원주 보현사 법당 工事', 24),
  (1999, '군포 수지사 법당 工事', 25),
  (1998, '천안 만경사 법당 工事', 26),
  (1997, '수덕사 견승암 工事', 27),
  (1996, '대전 흥룡사 법당 工事', 28),
  (1995, '경주 보문단지 신라촌 129동 工事', 29),
  (1993, '양양 명주사 법당 보수 工事', 30),
  (1991, '봉은사 사내 상가 工事', 31),
  (1990, '연안이씨 사당 工事', 32),
  (1990, '인천 도원동 보각선원 법당 工事', 33),
  (1987, '올림픽공원 팔각정 工事', 34),
  (1986, '수덕사 황하루 工事', 35),
  (1985, '태안 공덕사 법당 工事', 36),
  (1984, '올림픽공원 팔각정 工事', 37),
  (1984, '송추 오봉산 석굴암 산신각 工事', 38),
  (1982, '아차산 대성암 법당 工事', 39),
  (1981, '구의동 양천사 법당 工事', 40),
  (1980, '중곡동 대순진리회본전 工事', 41),
  (1979, '남양주 오봉산 석굴암 요사처 신축 工事', 42),
  (1979, '구의동 화양사 법당 工事', 43),
  (1976, '태안 흥주사 법당 工事', 44),
  (1975, '인천 보각사 법당 工事', 45),
  (1974, '용문사 주지실 工事', 46),
  (1974, '성북동 성라암 법당신축 工事', 47),
  (1973, '평택 만기사 극락전 工事', 48),
  (1973, '전남 광주 장열사 사당신축 工事', 49),
  (1972, '평택 만기사 법당 工事', 50),
  (1972, '양평 용문사 요사처 신축 工事', 51),
  (1972, '강화 전등사 범종각 신축', 52),
  (1972, '부여 고란사 종각 신축 工事', 53),
  (1971, '남양주 오봉산 석굴암 법당 신축 工事', 54),
  (1970, '안양 망혜암 종각 신축 工事', 55),
  (1969, '송추 오봉산 석굴암 법당 工事', 56),
  (1968, '진관사 명부전 신축 工事', 57),
  (1968, '도봉산 망월사 요사처 법당 신축 工事', 58),
  (1966, '영월 사자산법흥사 법당 신축 工事', 59),
  (1964, '경북 김천 직지사 요사처 신축 工事', 60),
  (1963, '낙산사 누각 신축 工事', 61),
  (1963, '낙산사 홍련암 신축 工事', 62),
  (1962, '진관동 진관사 요사처 신축 工事', 63),
  (1962, '성북동 녹야원 법당 신축 工事', 64),
  (1961, '서울돈암동 녹야원 법당 工事', 65),
  (1961, '대전 보문산 복전암 요사처 신축 工事', 66),
  (1960, '진관동 진관사 법당 신축 工事', 67),
  (1960, '무량사 봉향각 신축 工事', 68),
  (1959, '양양 낙산사 홍연암 법당 신축 工事', 69),
  (1958, '인천 수봉산 부용암 법당신축 工事', 70),
  (1958, '양양 낙산사 일주문 신축 工事', 71),
  (1958, '대전 보문산 복전암 법당 工事', 72),
  (1957, '강원진부 월정사 법당 신축 工事', 73),
  (1936, '수덕사 대웅전 보수 工事', 74)
) as v(year, title, sort_order)
where not exists (select 1 from ma_history_works);

-- 끝. 이제 Authentication → Users → Add user 로 관리자 계정을 만드세요.
