-- ============================================================
-- 작업 사례 분류에 "도면"(drawing) 추가.
-- SQL Editor에 붙여넣고 Run. (한 번만, 재실행해도 안전)
-- ============================================================
alter table ma_works drop constraint if exists ma_works_category_check;
alter table ma_works add constraint ma_works_category_check
  check (category in ('maintenance','repair','fabrication','drawing'));
