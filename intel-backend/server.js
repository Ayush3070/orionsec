import "dotenv/config";
import express from "express";
import { intelRouter } from "./routes/intel.js";
import { startScheduler } from "./scheduler.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/intel", intelRouter);

// Start background scheduler
const schedulerJob = startScheduler();

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`OrionSec intel backend listening on :${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  schedulerJob.stop();
  process.exit(0);
});

