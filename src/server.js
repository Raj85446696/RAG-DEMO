import express from "express";
import { chat } from "./chat.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const answer = await chat(req.body.question);
  res.json({ answer });
});

app.listen(8000, () =>
  console.log("🚀 RAG server running on port 8000")
);
