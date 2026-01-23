import { build } from "esbuild";
import { copyFileSync, mkdirSync, existsSync } from "fs";

const outdir = "dist";

// Ensure dist exists
if (!existsSync(outdir)) {
  mkdirSync(outdir, { recursive: true });
}

// Build background service worker
await build({
  entryPoints: ["src/background/index.ts"],
  bundle: true,
  outfile: `${outdir}/background.js`,
  format: "esm",
  target: "es2022",
  platform: "browser",
});

// Build content script
await build({
  entryPoints: ["src/content/index.ts"],
  bundle: true,
  outfile: `${outdir}/content.js`,
  format: "iife",
  target: "es2022",
  platform: "browser",
});

// Copy static files
copyFileSync("manifest.json", `${outdir}/manifest.json`);
copyFileSync("popup.html", `${outdir}/popup.html`);

console.log("Build complete: dist/");
