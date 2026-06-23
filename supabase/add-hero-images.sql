-- 홈 히어로 슬라이드 4장 (배경 이미지 + 카피라이팅)
INSERT INTO ma_settings (key, value) VALUES
  ('hero_slide_1_img', ''), ('hero_slide_1_h1a', ''), ('hero_slide_1_h1b', ''), ('hero_slide_1_sub', ''),
  ('hero_slide_2_img', ''), ('hero_slide_2_h1a', ''), ('hero_slide_2_h1b', ''), ('hero_slide_2_sub', ''),
  ('hero_slide_3_img', ''), ('hero_slide_3_h1a', ''), ('hero_slide_3_h1b', ''), ('hero_slide_3_sub', ''),
  ('hero_slide_4_img', ''), ('hero_slide_4_h1a', ''), ('hero_slide_4_h1b', ''), ('hero_slide_4_sub', '')
ON CONFLICT (key) DO NOTHING;

-- 페이지 히어로 (장인소개, 작업사례 데스크탑/모바일)
INSERT INTO ma_settings (key, value) VALUES
  ('page_hero_masterartisan', ''),
  ('page_hero_works', ''),
  ('page_hero_works_mobile', '')
ON CONFLICT (key) DO NOTHING;

-- 콘트라스트 섹션 이미지 (다릅니다 / 바릅니다)
INSERT INTO ma_settings (key, value) VALUES
  ('contrast_left_img',  ''),
  ('contrast_right_img', '')
ON CONFLICT (key) DO NOTHING;
