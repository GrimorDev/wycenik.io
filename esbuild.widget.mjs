import { build } from "esbuild";
import { statSync } from "node:fs";

const BUDGET_BYTES = 30 * 1024;

async function main() {
  await build({
    entryPoints: ["widget/src/index.tsx"],
    outfile: "public/widget.js",
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2018"],
    jsx: "automatic",
    jsxImportSource: "preact",
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "info",
  });

  const { size } = statSync("public/widget.js");
  const kb = (size / 1024).toFixed(1);
  console.log(`widget.js: ${kb} KB`);
  if (size > BUDGET_BYTES) {
    console.warn(`Warning: widget.js exceeds the 30 KB budget (${kb} KB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
