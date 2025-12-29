import { PineconeStore } from "langchain/vectorstores/pinecone";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { index } from "./config/pinecone.js";

export async function search(query) {
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    { pineconeIndex: index }
  );

  const results = await vectorStore.similaritySearch(query, 3);
  return results;
}
