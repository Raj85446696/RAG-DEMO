import ollama from "ollama";
import { search } from "./search.js";

export async function chat(question) {
  const docs = await search(question);
  const context = docs.map(d => d.pageContent).join("\n");

  const response = await ollama.chat({
    model: "phi3",
    messages: [
      { role: "system", content: "Answer only from given context." },
      { role: "user", content: `Context:\n${context}\n\nQuestion:\n${question}` }
    ]
  });

  return response.message.content;
}
