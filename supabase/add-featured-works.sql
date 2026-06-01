-- ============================================================
-- 메인(홈) 작업사례 지정 기능 — ma_works에 노출 여부/순서 컬럼 추가.
-- SQL Editor에 붙여넣고 Run. (한 번만, 재실행해도 안전)
-- ============================================================
alter table ma_works add column if not exists featured boolean not null default false;
alter table ma_works add column if not exists featured_order int not null default 0;

-- (선택) 처음 화면을 채우고 싶다면, 작업 3개를 홈에 노출시키는 예시:
-- update ma_works set featured = true, featured_order = 0 where title = '수원 사찰 대웅전 보수';
-- update ma_works set featured = true, featured_order = 1 where title = '경기도 향교 기와 보수';
-- update ma_works set featured = true, featured_order = 2 where title = '전통 누각 복원';
