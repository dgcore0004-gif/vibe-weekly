/**
 * esbuild 직접 번들러
 * npm run build 로 실행
 */
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "dist");
const assetsDir = join(distDir, "assets");

mkdirSync(assetsDir, { recursive: true });

// JS 번들
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  outfile: join(assetsDir, "index.js"),
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  jsxImportSource: "react",
  loader: { ".tsx": "tsx", ".ts": "ts" },
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  metafile: true,
});

// CSS 복사
copyFileSync(join(__dirname, "src/index.css"), join(assetsDir, "index.css"));

// public 파일 복사
for (const f of ["robots.txt", "data.json"]) {
  try { copyFileSync(join(__dirname, "public", f), join(distDir, f)); } catch {}
}

// index.html 생성
const html = readFileSync(join(__dirname, "index.html"), "utf-8").replace(
  '<script type="module" src="/src/main.tsx"></script>',
  '<link rel="stylesheet" href="/assets/index.css" />\n    <script type="module" src="/assets/index.js"></script>'
);
writeFileSync(join(distDir, "index.html"), html, "utf-8");

const bytes = result.metafile
  ? Object.values(result.metafile.outputs).reduce((s, o) => s + o.bytes, 0)
  : 0;
console.log(`✅ dist/ 빌드 완료 — ${(bytes / 1024).toFixed(1)} kB`);
