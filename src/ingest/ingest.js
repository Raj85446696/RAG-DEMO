import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔥 Using LOCAL Ollama embeddings + Qdrant");

// 📄 PDF text extractor
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
  const pdfPath = path.join(__dirname, "../../data/Umang_data.pdf");
  console.log("📄 PDF PATH:", pdfPath);

  if (!fs.existsSync(pdfPath)) {
    throw new Error("❌ PDF not found");
  }

  // 1️⃣ Extract text
  const text = await extractTextFromPDF(pdfPath);

  // 2️⃣ Chunk text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments([text]);

  // 3️⃣ Local embeddings (Ollama)
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text", // 768-dim
  });

  // 4️⃣ Store in Qdrant
  await QdrantVectorStore.fromDocuments(docs, embeddings, {
    url: "http://localhost:6333",
    collectionName: "umang_docs",
  });

  console.log("✅ Vector DB created successfully in Qdrant");
}

ingest().catch(console.error);
