import { watchedAssets, feeds } from "./config.mjs";

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "user-agent": "crucix-cn-lite" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function fetchPrices() {
  const out = [];
  await Promise.allSettled(
    watchedAssets.map(async (asset) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(asset.key)}?interval=1d&range=5d`;
      const data = await fetchJson(url);
      const r = data?.chart?.result?.[0];
      const quote = r?.indicators?.quote?.[0];
      const close = quote?.close || [];
      const now = toNum(close[close.length - 1]);
      const prev = toNum(close[close.length - 2]);
      const changePct = now && prev ? ((now - prev) / prev) * 100 : null;
      out.push({ ...asset, price: now, prevClose: prev, changePct });
    })
  );
  return out.sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function extractRssItems(xml, limit = 8) {
  const items = [];
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const block of blocks.slice(0, limit)) {
    const title = (block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "").trim();
    const link = (block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim();
    const pubDate = (block.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "").trim();
    if (title && link) items.push({ title, link, pubDate });
  }
  return items;
}

async function fetchFeed(url) {
  const res = await fetch(url, { headers: { "user-agent": "crucix-cn-lite" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  return extractRssItems(xml, 6);
}

export async function fetchIntel() {
  const result = { geopolitical: [], supplyChain: [], industryIntel: [] };
  for (const [k, urls] of Object.entries(feeds)) {
    const chunks = await Promise.allSettled(urls.map((u) => fetchFeed(u)));
    result[k] = chunks
      .filter((x) => x.status === "fulfilled")
      .flatMap((x) => x.value)
      .slice(0, 10);
  }
  return result;
}
