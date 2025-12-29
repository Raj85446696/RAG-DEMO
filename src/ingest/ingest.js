import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";


import { index } from "../config/pinecone.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔥 Using LOCAL Ollama embeddings");

async function extractTextFromPDF(pdfPath) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const pdf = await pdfjsLib.getDocument({ data }).promise;

  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  return text;
}

async function ingest() {
  const pdfPath = path.join(__dirname, "../../data/myData.pdf");

  console.log("📄 PDF PATH:", pdfPath);

  if (!fs.existsSync(pdfPath)) {
    throw new Error("PDF not found");
  }

  // 1️⃣ Extract text
  const text = await extractTextFromPDF(pdfPath);

  // 2️⃣ Chunking
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);

  // 3️⃣ LOCAL Embeddings (NO API, NO QUOTA)
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  // 4️⃣ Store in Pinecone
  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
  });

  console.log("✅ Vector DB created using LOCAL Ollama embeddings");
}

ingest();
