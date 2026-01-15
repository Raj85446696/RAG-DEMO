import app from './app.js';

const PORT = process.env.PORT || 8001;

app.listen(PORT, () =>
  console.log(`🚀RAG server running on port ${PORT}`)
);
