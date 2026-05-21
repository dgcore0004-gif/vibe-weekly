# Vibe Weekly

AI 개발자들을 위한 주간 바이브코딩 트렌드 레이더.
매주 금요일 Reddit, HN, GitHub에서 자동 수집 → Claude로 요약 → Netlify 자동 배포.

## 구조

```
src/                  # React 프론트엔드
public/data.json      # 매주 자동 교체되는 트렌드 데이터
scripts/collect.mjs   # 수집 스크립트 (Reddit + HN + GitHub + Claude)
.github/workflows/    # 매주 금요일 자동 실행
build.mjs             # esbuild 번들러
```

## 로컬 개발

```bash
npm install
npm run dev       # 개발 서버 (localhost:5173)
npm run build     # dist/ 빌드
```

## 배포 (최초 1회)

1. GitHub 레포에 push
2. [Netlify](https://app.netlify.com) → Add new site → Import from GitHub
   - Build command: `npm run build`
   - Publish directory: `dist`
3. GitHub Secrets 등록 (Settings → Secrets → Actions):
   - `ANTHROPIC_API_KEY`
   - `REDDIT_CLIENT_ID`
   - `REDDIT_CLIENT_SECRET`

이후 매주 금요일 오전 9시(KST) 자동 실행됩니다.

## 수동 수집 실행

```bash
cp .env.example .env
# .env 파일에 실제 키 입력 후:
cd scripts && npm install && cd ..
node scripts/collect.mjs
```

## Reddit 앱 등록 (5분)

1. https://www.reddit.com/prefs/apps 접속
2. "Create another app" 클릭
3. 타입: **script**
4. redirect uri: `http://localhost`
5. 생성 후 client_id (앱 이름 아래 짧은 문자열)와 secret 복사

## 기술 스택

- React 18 + TypeScript
- Tailwind CSS (CDN)
- esbuild (번들러)
- GitHub Actions (자동화)
- Netlify (호스팅)
- Claude API (요약)
- Reddit API + HN API + GitHub API (수집)
