// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * verifiedGate — fails the build if any file in content/ still has
 * `verified: false`, unless PUBLIC_ALLOW_UNVERIFIED=1 (preview environments
 * only). Runs on every build, independent of Astro's content cache.
 */
function verifiedGate() {
  return {
    name: "arculus:verified-gate",
    hooks: {
      "astro:build:start": () => {
        if (process.env.PUBLIC_ALLOW_UNVERIFIED === "1") {
          console.warn("[verified-gate] PUBLIC_ALLOW_UNVERIFIED=1 — building with unverified content. Preview only.");
          return;
        }
        const root = join(process.cwd(), "content");
        /** @type {string[]} */
        const unverified = [];
        /** @param {string} dir */
        const walk = (dir) => {
          for (const name of readdirSync(dir)) {
            const p = join(dir, name);
            if (statSync(p).isDirectory()) { walk(p); continue; }
            const text = readFileSync(p, "utf8");
            const isFalse = name.endsWith(".json")
              ? /"verified"\s*:\s*false/.test(text)
              : /^verified:\s*false\s*$/m.test(text);
            if (isFalse) unverified.push(relative(process.cwd(), p));
          }
        };
        walk(root);
        if (unverified.length) {
          throw new Error(
            `[verified-gate] ${unverified.length} content file(s) still verified: false.\n  ` +
            unverified.join("\n  ") +
            "\nClear them on docs/compliance-register.md and set verified: true, or set PUBLIC_ALLOW_UNVERIFIED=1 for a preview build."
          );
        }
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [verifiedGate()],
  vite: { plugins: [tailwindcss()] },
});
