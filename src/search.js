import dotenv from "dotenv";
import { QdrantVectorStore } from "@langchain/qdrant";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

dotenv.config();

export async function search(query, k = 3) {
  // 1️⃣ Same embeddings used during ingest
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  // 2️⃣ Connect to existing Qdrant collection
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: "http://localhost:6333",
      collectionName: "umang_docs",
    }
  );

  // 3️⃣ Similarity search
  const results = await vectorStore.similaritySearch(query, k);

  return results;
}
