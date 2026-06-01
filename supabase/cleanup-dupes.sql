-- ============================================================
-- 중복 시드 정리 — 작업/연혁이 두 번 들어간 경우 각 항목 1개만 남김.
-- SQL Editor에 붙여넣고 Run. (스키마/정책은 건드리지 않음, 중복 행만 삭제)
-- 여러 번 실행해도 안전.
-- ============================================================

-- 작업: 같은 (제목·분류·연도·이미지) 중복 제거
delete from ma_works a
using ma_works b
where a.ctid < b.ctid
  and a.title = b.title
  and a.category = b.category
  and coalesce(a.year, '') = coalesce(b.year, '')
  and coalesce(a.image_url, '') = coalesce(b.image_url, '');

-- 연혁: 같은 (연도·제목) 중복 제거 (연결된 사진은 FK로 함께 정리됨)
delete from ma_history_works a
using ma_history_works b
where a.ctid < b.ctid
  and a.year = b.year
  and a.title = b.title;

-- 확인용: 정리 후 개수 (작업 9 / 연혁 75 가 정상)
select 'ma_works' as t, count(*) from ma_works
union all
select 'ma_history_works', count(*) from ma_history_works;
