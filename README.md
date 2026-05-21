# Vibe Weekly

AI 개발자들을 위한 주간 바이브코딩 트렌드 레이더.  
매주 금요일 **Tavily API**로 웹 전체를 검색 → 자동 분류 → Netlify 자동 배포.

## 구조

```
Netlify 빌드 시작
  → scripts/collect.mjs 실행 (Tavily 검색)
  → public/data.json 업데이트
  → npm run build (esbuild)
  → dist/ 배포
```

## 필요한 것

| 항목 | 무료? | 링크 |
|---|---|---|
| Tavily API 키 | ✅ 1,000회/월 무료 | https://app.tavily.com |
| Netlify 계정 | ✅ 무료 | https://netlify.com |
| cron-job.org | ✅ 무료 | https://cron-job.org |

**GitHub Secrets 불필요, GitHub Actions 불필요.**

## 배포 설정 (최초 1회)

### 1. Netlify 연결

[app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub → `vibe-weekly`
- Build command: `node scripts/collect.mjs && npm run build`
- Publish directory: `dist`

### 2. Netlify 환경변수 등록

Netlify 대시보드 → Site settings → **Environment variables** → Add variable
- Key: `TAVILY_API_KEY`
- Value: `tvly-...` (Tavily 키)

### 3. Netlify Build Hook 생성

Netlify 대시보드 → Site settings → **Build & deploy** → Build hooks → Add build hook
- Hook name: `Weekly Cron`
- 생성된 URL 복사 (예: `https://api.netlify.com/build_hooks/xxxx`)

### 4. cron-job.org 설정

[cron-job.org](https://cron-job.org) 가입 → Create cronjob
- URL: 위에서 복사한 Build Hook URL
- Schedule: 매주 금요일 09:00 (KST)

## 로컬 테스트

```powershell
# Windows
$env:TAVILY_API_KEY="tvly-..."; node scripts/collect.mjs
npm run build
```

## 기술 스택

- React 18 + TypeScript
- Tailwind CSS (CDN)
- esbuild (번들러)
- Tavily API (웹 검색 수집)
- Netlify (호스팅 + 빌드)
- cron-job.org (주간 트리거)
