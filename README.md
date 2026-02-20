# Gravii Dashboard (Next.js)

기존 단일 HTML 대시보드를 Next.js App Router 기반으로 변환한 프로젝트입니다.

## 실행 방법

패키지 매니저: **Bun**

```bash
bun install
bun run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속 시 `/dashboard`로 리다이렉트됩니다.

## 구조

- **`/`** → `/dashboard`로 리다이렉트
- **`/dashboard`** — Overview (TVL/TIV 도넛, 체인별 바 차트, KPI 카드)
- **`/dashboard/analytics`** — User Analytics (체인 탭, 그룹별 지표)
- **`/dashboard/labels`** — User Segments (By Behavior / By Value, 라벨 필터·요약)
- **`/dashboard/risk`** — Risk & Sybil (리스크 도넛, 클러스터, 플래그 테이블)
- **`/dashboard/campaigns`** — Campaign Launch Manager (캠페인 목록 + 생성 폼)

## 기술 스택

- Next.js 15 (App Router)
- React 19
- TypeScript
- 기존 디자인 유지 (CSS 변수·클래스는 `src/app/globals.css`에 그대로 이전)

## 주요 파일

| 경로 | 설명 |
|------|------|
| `src/app/layout.tsx` | 루트 레이아웃, Outfit/Space Mono 폰트 |
| `src/app/dashboard/layout.tsx` | 사이드바 + 메인 영역 |
| `src/components/dashboard/Sidebar.tsx` | 네비게이션 사이드바 (클라이언트) |
| `src/components/dashboard/DonutCard.tsx` | 도넛 차트 카드 컴포넌트 |
| `src/lib/labels-data.ts` | User Segments 라벨 데이터 |

기존 HTML의 페이지 전환(단일 페이지 내 `data-page` 토글)은 **라우트 기반**으로 바뀌었고, 사이드바는 `next/link`와 `usePathname()`으로 활성 상태를 표시합니다.
# dashboard
