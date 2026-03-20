#!/usr/bin/env node
/**
 * generate-readme.js
 * Reads website/projects.json and rewrites the A–Z section of README.md
 * Run: node scripts/generate-readme.js
 */

const fs = require("fs");
const path = require("path");

const PROJECTS_PATH = path.resolve(__dirname, "../website/projects.json");
const README_PATH = path.resolve(__dirname, "../README.md");

const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, "utf8"));

// Group by letter
const byLetter = {};
for (const p of projects) {
  const l = p.letter.toUpperCase();
  if (!byLetter[l]) byLetter[l] = [];
  byLetter[l].push(p);
}

const letters = Object.keys(byLetter).sort();

let listMd = `<!-- PROJECTS_START -->\n`;

// Nav bar
const navLinks = letters
  .map((l) => `[**${l}**](#${l.toLowerCase()})`)
  .join(" · ");
listMd += `<p align="center" class="nav-menu">\n${navLinks}\n</p>\n\n`;

// Project entries
for (const letter of letters) {
  listMd += `## ${letter}\n\n`;
  for (const p of byLetter[letter]) {
    const techBadges = p.tech.map((t) => `\`${t}\``).join(" ");
    listMd += `- [${p.name}](${p.repo}) — ${p.emoji} ${p.description} **By [@${p.author}](${p.authorUrl})** ${techBadges}\n`;
  }
  listMd += "\n";
}

listMd += `<!-- PROJECTS_END -->`;

// Read README and replace between markers
const readme = fs.readFileSync(README_PATH, "utf8");

const START = "<!-- PROJECTS_START -->";
const END = "<!-- PROJECTS_END -->";

const startIdx = readme.indexOf(START);
const endIdx = readme.indexOf(END) + END.length;

if (startIdx === -1 || endIdx === -1) {
  console.error(
    "❌  Could not find PROJECTS_START / PROJECTS_END markers in README.md",
  );
  process.exit(1);
}

const newReadme = readme.slice(0, startIdx) + listMd + readme.slice(endIdx);
fs.writeFileSync(README_PATH, newReadme, "utf8");

console.log(
  `✅  README.md updated — ${projects.length} projects across ${letters.length} letters`,
);
