-- ============================================================
-- 사이트 설정 테이블 — 메인 작업사례 "랜덤 표시" 토글 저장용.
-- SQL Editor에 붙여넣고 Run. (한 번만, 재실행해도 안전)
-- ============================================================
create table if not exists ma_settings (
  key text primary key,
  value text not null default ''
);
alter table ma_settings enable row level security;

drop policy if exists "public read ma_settings" on ma_settings;
drop policy if exists "auth write ma_settings" on ma_settings;
create policy "public read ma_settings" on ma_settings for select using (true);
create policy "auth write ma_settings" on ma_settings for all to authenticated using (true) with check (true);

insert into ma_settings (key, value) values ('home_works_random', 'false')
on conflict (key) do nothing;
