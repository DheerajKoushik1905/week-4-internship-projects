import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/status", (_req, res) => {
  res.json({
    message: "React frontend is successfully connected to the Node.js backend.",
    serverTime: new Date().toISOString()
  });
});

const port = process.env.PORT || 5201;
app.listen(port, () => console.log(`Integration API running on http://localhost:${port}`));
