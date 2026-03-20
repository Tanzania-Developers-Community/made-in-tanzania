#!/usr/bin/env node
/**
 * validate-projects.js
 * Validates every entry in website/projects.json against the required schema.
 * Run: node scripts/validate-projects.js
 */

const fs = require("fs");
const path = require("path");

const REQUIRED = [
  "name",
  "description",
  "emoji",
  "tech",
  "author",
  "authorUrl",
  "repo",
  "letter",
];
const projects = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../website/projects.json"), "utf8"),
);

let errors = 0;

projects.forEach((p, i) => {
  REQUIRED.forEach((field) => {
    if (!p[field]) {
      console.error(
        `❌  projects[${i}] "${p.name || "?"}" — missing field: "${field}"`,
      );
      errors++;
    }
  });
  if (p.letter && p.letter.length !== 1) {
    console.error(
      `❌  projects[${i}] "${p.name}" — "letter" must be a single character`,
    );
    errors++;
  }
  if (p.repo && !p.repo.startsWith("https://")) {
    console.error(
      `❌  projects[${i}] "${p.name}" — "repo" must be a full https URL`,
    );
    errors++;
  }
  if (!Array.isArray(p.tech)) {
    console.error(`❌  projects[${i}] "${p.name}" — "tech" must be an array`);
    errors++;
  }
});

if (errors === 0) {
  console.log(`✅  All ${projects.length} projects are valid`);
} else {
  console.error(`\n${errors} error(s) found. Fix them before opening a PR.`);
  process.exit(1);
}
