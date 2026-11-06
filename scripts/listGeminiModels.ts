import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { GoogleGenAI } from "@google/genai";

async function loadGeminiApiKey() {
  const environmentFile = await readFile(resolve(process.cwd(), ".env.local"), "utf8");
  const match = environmentFile.match(/^\s*GEMINI_API_KEY\s*=\s*(.*?)\s*$/m);
  const apiKey = match?.[1]?.replace(/^['"]|['"]$/g, "").trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from .env.local.");
  }

  return apiKey;
}

async function listModels() {
  const apiKey = await loadGeminiApiKey();
  const gemini = new GoogleGenAI({ apiKey });
  const pager = await gemini.models.list({ config: { pageSize: 1000 } });
  const models = [];

  for await (const model of pager) {
    models.push(model);
  }

  for (const model of models) {
    console.log(`Model ID: ${model.name ?? "Unavailable"}`);
    console.log(`Display name: ${model.displayName ?? "Unavailable"}`);
    console.log(`Supported generation methods: ${model.supportedActions?.join(", ") ?? "Unavailable"}`);
    console.log("");
  }

  console.log(`Total models: ${models.length}`);
}

listModels().catch((error: unknown) => {
  console.error("Unable to list Gemini models.");
  console.error(error);
  process.exitCode = 1;
});
