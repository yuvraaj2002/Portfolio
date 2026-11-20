#!/usr/bin/env node
/**
 * Portfolio VO wrapper — default provider: local MLX Kokoro (no API key).
 *
 * Usage:
 *   npm run tts -- --text "I build AI systems that make it to production."
 *   npm run tts -- --segments segments.json
 *   npm run tts -- --provider gemini --segments segments.json   # needs GEMINI_API_KEY
 *
 * Kokoro defaults: voice af_heart (locked), output public/vo/, American English.
 */

import { existsSync, readFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const launchRoot = resolve(__dirname, "..");
const repoRoot = resolve(launchRoot, "..");
const kokoroScript = join(launchRoot, "scripts", "generate_kokoro_tts.py");
const geminiScript = resolve(
  repoRoot,
  ".agents/skills/gemini-tts/scripts/generate-tts.mjs"
);
const venvPython = join(launchRoot, ".venv", "bin", "python");

const DEFAULT_OUTPUT = join(launchRoot, "public", "vo");
const KOKORO_VOICE = "af_heart";
const GEMINI_VOICE = "Charon";
const GEMINI_NOTES =
  "Style: Calm, precise, confident professional narrator. Clear diction, no hype. " +
  "Pacing: Moderate — deliberate, with short breaths between beats. " +
  "Accent: Neutral American English.";

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

function takeFlag(args, flag) {
  const i = args.indexOf(flag);
  if (i === -1) return { args, value: null };
  const next = args[i + 1];
  if (!next || next.startsWith("--")) {
    return { args: [...args.slice(0, i), ...args.slice(i + 1)], value: true };
  }
  return {
    args: [...args.slice(0, i), ...args.slice(i + 2)],
    value: next,
  };
}

function hasValueFlag(args, flag) {
  const i = args.indexOf(flag);
  return i !== -1 && i + 1 < args.length && !args[i + 1].startsWith("--");
}

loadEnvFile(join(launchRoot, ".env"));
loadEnvFile(join(repoRoot, ".env"));

let userArgs = process.argv.slice(2);
const help = userArgs.includes("--help") || userArgs.includes("-h");

let provider = "kokoro";
const providerTaken = takeFlag(userArgs, "--provider");
userArgs = providerTaken.args;
if (typeof providerTaken.value === "string") {
  provider = providerTaken.value.toLowerCase();
}

if (help) {
  console.log(`Usage:
  npm run tts -- --text "..."
  npm run tts -- --segments segments.json
  npm run tts -- --provider gemini --segments segments.json

Providers:
  kokoro  (default)  Local mlx-audio Kokoro — no API key
  gemini             Google Gemini TTS — needs GEMINI_API_KEY

Kokoro voice for this project is locked to af_heart.
`);
  process.exit(0);
}

if (provider === "kokoro" || provider === "mlx" || provider === "local") {
  if (!existsSync(kokoroScript)) {
    console.error(`Missing ${kokoroScript}`);
    process.exit(1);
  }
  if (!existsSync(venvPython)) {
    console.error(
      "Missing launch-video/.venv. Create it with:\n" +
        "  cd launch-video && uv venv --python 3.12 .venv && source .venv/bin/activate\n" +
        '  uv pip install "mlx-audio[tts]" "misaki[en]" soundfile'
    );
    process.exit(1);
  }

  const forwarded = [...userArgs];
  if (!hasValueFlag(forwarded, "--output-dir")) {
    forwarded.push("--output-dir", DEFAULT_OUTPUT);
  }
  // Force project voice — ignore any --voice override for Kokoro
  const cleaned = [];
  for (let i = 0; i < forwarded.length; i++) {
    if (forwarded[i] === "--voice") {
      i += 1;
      continue;
    }
    cleaned.push(forwarded[i]);
  }
  cleaned.push("--voice", KOKORO_VOICE);

  const child = spawn(venvPython, [kokoroScript, ...cleaned], {
    cwd: launchRoot,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else if (provider === "gemini") {
  if (!existsSync(geminiScript)) {
    console.error(`Missing gemini-tts script at ${geminiScript}`);
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error(
      "GEMINI_API_KEY is not set. Copy launch-video/.env.example to launch-video/.env and add your key."
    );
    process.exit(1);
  }

  const forwarded = [...userArgs];
  if (!hasValueFlag(forwarded, "--output-dir")) {
    forwarded.push("--output-dir", DEFAULT_OUTPUT);
  }
  if (!hasValueFlag(forwarded, "--voice")) {
    forwarded.push("--voice", GEMINI_VOICE);
  }
  if (!hasValueFlag(forwarded, "--director-notes")) {
    forwarded.push("--director-notes", GEMINI_NOTES);
  }

  const child = spawn(process.execPath, [geminiScript, ...forwarded], {
    cwd: launchRoot,
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    process.exit(code ?? 1);
  });
} else {
  console.error(`Unknown --provider ${provider}. Use kokoro or gemini.`);
  process.exit(1);
}
