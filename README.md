# Vibe Weekly

AI 개발자들을 위한 주간 바이브코딩 트렌드 레이더.  
매주 금요일 **Tavily API**로 웹 전체를 검색 → 자동 분류 → Netlify 자동 배포.

## 구조

```
src/                  # React 프론트엔드
public/data.json      # 매주 자동 교체되는 트렌드 데이터
scripts/collect.mjs   # Tavily 수집 스크립트
.github/workflows/    # 매주 금요일 오전 9시(KST) 자동 실행
build.mjs             # esbuild 번들러
```

## 필요한 것

| 항목 | 무료? | 링크 |
|---|---|---|
| Tavily API 키 | ✅ 1,000회/월 무료 | https://app.tavily.com |
| GitHub 계정 | ✅ 무료 | — |
| Netlify 계정 | ✅ 무료 | https://netlify.com |

## 로컬 개발

```bash
npm install
npm run dev       # 개발 서버 (localhost:5173)
npm run build     # dist/ 빌드
```

## 로컬 수집 테스트

```bash
# .env 파일 생성
echo "TAVILY_API_KEY=tvly-..." > .env

# Windows
$env:TAVILY_API_KEY="tvly-..."; node scripts/collect.mjs

# Mac/Linux
TAVILY_API_KEY=tvly-... node scripts/collect.mjs
```

## 배포 (최초 1회)

**1. GitHub Secret 등록**  
[Settings → Secrets → Actions](../../settings/secrets/actions) 에서:
- `TAVILY_API_KEY` → Tavily 키 입력

**2. Netlify 연결**  
[app.netlify.com](https://app.netlify.com) → Add new site → Import from GitHub → `vibe-weekly`
- Build command: `npm run build`
- Publish directory: `dist`

이후 매주 금요일 자동으로 수집 → 빌드 → 배포됩니다.

## 기술 스택

- React 18 + TypeScript
- Tailwind CSS (CDN)
- esbuild (번들러)
- Tavily API (웹 검색 수집)
- GitHub Actions (자동화)
- Netlify (호스팅)
