#!/usr/bin/env node

// @tambo-ai/react ships a package.json "exports" field where the
// "development" condition points to "./src/index.ts" — a file that
// does not exist in the published package. Turbopack (Next.js dev
// server) resolves the "development" condition and fails.
//
// This script removes the "development" key from every export entry
// so that Turbopack falls through to "import"/"require" instead.

const fs = require("fs");
const path = require("path");

const pkgPath = path.join(
  __dirname,
  "..",
  "node_modules",
  "@tambo-ai",
  "react",
  "package.json",
);

if (!fs.existsSync(pkgPath)) {
  process.exit(0);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
let changed = false;

if (pkg.exports && typeof pkg.exports === "object") {
  for (const key of Object.keys(pkg.exports)) {
    const entry = pkg.exports[key];
    if (entry && typeof entry === "object" && "development" in entry) {
      delete entry.development;
      changed = true;
    }
  }
}

if (changed) {
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("Patched @tambo-ai/react: removed development export condition");
}
