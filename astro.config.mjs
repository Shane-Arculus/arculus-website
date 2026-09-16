// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/**
 * verifiedGate — fails the build if any file in content/ still has
 * `verified: false`. Runs on every build, independent of Astro's content cache.
 *
 * Unverified content is allowed on preview builds only. A build is a preview when
 * either PUBLIC_ALLOW_UNVERIFIED=1 is set, or the CI branch (Cloudflare sets
 * WORKERS_CI_BRANCH for Workers Builds, CF_PAGES_BRANCH for Pages) is anything
 * other than `main`. So: push to `main` = production = gate on; push to any
 * other branch = preview = gate off. Nothing to configure in the dashboard.
 */
function verifiedGate() {
  return {
    name: "arculus:verified-gate",
    hooks: {
      "astro:build:start": () => {
        const branch = process.env.WORKERS_CI_BRANCH || process.env.CF_PAGES_BRANCH || "";
        const isPreview = process.env.PUBLIC_ALLOW_UNVERIFIED === "1" || (branch !== "" && branch !== "main");
        if (isPreview) {
          console.warn(`[verified-gate] preview build${branch ? ` (branch ${branch})` : ""} — unverified content allowed. Never merge to main until the register clears.`);
          process.env.PUBLIC_ALLOW_UNVERIFIED = "1"; // so preview-only routes (/dev/components) build too
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
