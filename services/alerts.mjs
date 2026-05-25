export async function sendTelegramMessage(token, chatId, text) {
  if (!token || !chatId) return { skipped: true };
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true })
  });
  if (!res.ok) throw new Error(`Telegram HTTP ${res.status}`);
  return res.json();
}

export function buildAlerts(prevPrices, currPrices, thresholdPct) {
  const prevMap = new Map(prevPrices.map((x) => [x.key, x]));
  const alerts = [];
  for (const item of currPrices) {
    const old = prevMap.get(item.key);
    if (!old?.price || !item.price) continue;
    const movePct = ((item.price - old.price) / old.price) * 100;
    if (Math.abs(movePct) >= thresholdPct) {
      alerts.push({
        name: item.name,
        symbol: item.key,
        oldPrice: old.price,
        newPrice: item.price,
        movePct
      });
    }
  }
  return alerts;
}
