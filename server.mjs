import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./services/env.mjs";
import { fetchPrices, fetchIntel } from "./services/sources.mjs";
import { buildAlerts, sendTelegramMessage } from "./services/alerts.mjs";

loadEnv(path.resolve(".env"));

const PORT = Number(process.env.PORT || 3117);
const REFRESH_MINUTES = Number(process.env.REFRESH_MINUTES || 15);
const THRESHOLD = Number(process.env.ALERT_THRESHOLD_PERCENT || 1.2);
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

let state = { prices: [], intel: { geopolitical: [], supplyChain: [], industryIntel: [] }, updatedAt: null, thresholdPct: THRESHOLD };

async function runSweep() {
  const [prices, intel] = await Promise.all([fetchPrices(), fetchIntel()]);
  const alerts = buildAlerts(state.prices, prices, THRESHOLD);
  state = {
    prices,
    intel,
    updatedAt: new Date().toLocaleString("zh-CN", { hour12: false }),
    thresholdPct: THRESHOLD
  };

  for (const a of alerts.slice(0, 8)) {
    const text = `【价格异动】\n${a.name} (${a.symbol})\n旧价: ${a.oldPrice.toFixed(2)}\n新价: ${a.newPrice.toFixed(2)}\n波动: ${a.movePct.toFixed(2)}%`;
    await sendTelegramMessage(TG_TOKEN, TG_CHAT_ID, text);
  }

  console.log(`[sweep] ${state.updatedAt} | prices=${prices.length} | geo=${intel.geopolitical.length} | supply=${intel.supplyChain.length} | industry=${intel.industryIntel.length} | alerts=${alerts.length}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, "dashboard/public")));
app.get("/api/data", (_, res) => res.json(state));
app.get("/api/health", (_, res) => res.json({ ok: true, updatedAt: state.updatedAt }));

app.listen(PORT, async () => {
  console.log(`Crucix 中文快速版已启动: http://localhost:${PORT}`);
  try { await runSweep(); } catch (e) { console.error("首轮扫描失败:", e.message); }
  setInterval(() => runSweep().catch((e) => console.error("扫描失败:", e.message)), REFRESH_MINUTES * 60 * 1000);
});
