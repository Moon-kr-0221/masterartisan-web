<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 완료 게이트 — 한 번에 검증 (Definition of Done)

"정리/검증/다 됐어?" 류 요청은 **처음부터 전체 배터리를 한 번에 돌려 유한한 목록을 만든 뒤 닫는다.** 건드린 것만 그때그때 검증(반응형)하면 문제가 한 겹씩 직렬로 드러나 끝나지 않는다.

- **코드 게이트는 한 명령으로**: `npm run check` (= eslint + tsc --noEmit + build). 완료 선언 전 반드시 통과.
- **전수 점검**: 데스크탑↔모바일 parity는 일부 페이지가 아니라 전 페이지를 한 번에 훑는다.
- **신선한 상태로 검증**: `.next` 캐시·기존 dev 서버는 옛 번들을 줄 수 있어 거짓 PASS/FAIL을 낸다 → 새 빌드/서버로 확인.
- **데이터 vs 코드 구분**: 깨진 이미지·값은 코드가 아니라 CMS/DB(Supabase) 데이터일 수 있다. 앱이 DB 우선이면 코드 폴백 수정은 무효 → 실제 데이터 소스를 확인.

---

# UI 자동 검수 루프 (모든 UI 작업에 자동 적용)

모든 UI 수정 작업은 아래 루프를 완전히 통과하기 전까지 완료를 선언할 수 없다.

## Source of Truth

`masterartisan.pen` (Pencil 디자인 파일)이 유일한 기준이다. 코드·브라우저 캡처는 항상 Pencil 디자인에 맞춰야 한다.

## 의무 루프 절차

```
[1] Pencil 읽기
    └─ batch_get / get_screenshot 으로 수정 대상 보드 및 관련 노드를 모두 읽는다.
    └─ Desktop 보드 + Mobile 보드(M · …) 양쪽 모두 읽는다.

[2] 코드 수정
    └─ Pencil 디자인과 일치하도록 코드를 변경한다.
    └─ 데스크탑: md: prefix 또는 ≥768px 스타일
    └─ 모바일:  md: 없는 기본 스타일 또는 isMobile 분기

[3] Playwright 캡처
    └─ Desktop: viewport 1440×900, node screenshot.js 실행
    └─ Mobile:  viewport 390×844, --mobile 플래그 또는 별도 스크립트

[4] Pencil ↔ 캡처 비교
    └─ 레이아웃, 타이포그래피, 색상, 간격, 정렬, 이미지 비율을 항목별로 대조한다.
    └─ 차이가 발견되면 [2]로 돌아가 재수정한다.

[5] 통과 조건 — 아래 모두 만족해야 한다:
    ├─ Home Desktop    ✅
    ├─ Home Mobile     ✅
    ├─ About Desktop   ✅
    ├─ About Mobile    ✅
    ├─ Portfolio Desktop ✅
    ├─ Portfolio Mobile  ✅
    ├─ Contact Desktop ✅
    ├─ Contact Mobile  ✅
    └─ 기타 모든 Pencil 보드에 대응하는 페이지 ✅

[6] 완료 선언
    └─ 위 5번 조건이 전부 충족된 경우에만 "완료"라고 선언한다.
    └─ 한 페이지라도 미통과 상태이면 루프를 계속한다.
```

## 검수 항목 체크리스트

각 페이지·디바이스 조합에 대해 아래를 확인한다:

| 항목 | 확인 방법 |
|---|---|
| 섹션 높이 / 여백 | Pencil 노드 width·height·padding 값과 대조 |
| 타이포그래피 (폰트 크기·굵기·행간·자간) | Pencil 텍스트 노드 스타일과 대조 |
| 색상 | Pencil 노드 fill·color 값과 대조 (hex 정확히 일치) |
| 정렬 (좌/우/중앙) | Pencil 레이아웃 방향과 대조 |
| 이미지 비율·위치 | Pencil 이미지 노드 크기·crop과 대조 |
| 컴포넌트 위치 (absolute x/y) | Pencil 좌표 → CSS position 계산값 대조 |
| 반응형 전환점 | 768px 기준 Pencil 모바일 보드와 일치 여부 |

## 금지 사항

- Pencil을 읽지 않고 코드를 수정하는 행위
- Playwright 캡처 없이 "완료"를 선언하는 행위
- 픽셀 단위 비교를 하지 않고 "차이 없음"을 선언하는 행위
- 한 디바이스(Desktop 또는 Mobile)만 검수하고 완료로 처리하는 행위
- 일부 페이지만 검수하고 나머지를 건너뛰는 행위
