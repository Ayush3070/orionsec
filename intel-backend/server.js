import "dotenv/config";
import express from "express";
import { intelRouter } from "./routes/intel.js";
import { startScheduler } from "./scheduler.js";
import { getDb } from "./db.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", async (_req, res) => {
  try {
    await getDb();
    res.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ ok: false, error: e.message });
  }
});

app.use("/intel", intelRouter);

const schedulerJob = startScheduler();

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`OrionSec intel backend listening on :${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  schedulerJob.stop();
  process.exit(0);
});
