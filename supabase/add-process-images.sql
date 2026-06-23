-- ============================================================
-- 홈 Process 섹션 이미지 4장 관리 — ma_settings 키 추가
-- SQL Editor에 붙여넣고 Run. (한 번만, 재실행해도 안전)
-- ============================================================
insert into ma_settings (key, value) values
  ('process_img_1', ''),
  ('process_img_2', ''),
  ('process_img_3', ''),
  ('process_img_4', '')
on conflict (key) do nothing;
