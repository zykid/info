const cache = new Map();

function shouldTranslate(text) {
  if (!text || typeof text !== 'string') return false;
  return /[A-Za-z]/.test(text) && !/[\u4e00-\u9fff]/.test(text);
}

async function translateOne(text) {
  if (!shouldTranslate(text)) return text;
  if (cache.has(text)) return cache.get(text);

  try {
    const url = 'https://translate.googleapis.com/translate_a/single'
      + '?client=gtx&sl=auto&tl=zh-CN&dt=t&q=' + encodeURIComponent(text);
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return text;
    const data = await res.json();
    const translated = Array.isArray(data?.[0]) ? data[0].map(x => x?.[0] || '').join('') : text;
    cache.set(text, translated || text);
    return translated || text;
  } catch {
    return text;
  }
}

export async function autoTranslateV2(v2, enabled = false) {
  if (!enabled) return v2;

  if (Array.isArray(v2.newsFeed)) {
    for (const item of v2.newsFeed) {
      if (item?.headline) item.headline = await translateOne(item.headline);
    }
  }

  if (Array.isArray(v2.news)) {
    for (const item of v2.news) {
      if (item?.title) item.title = await translateOne(item.title);
    }
  }

  if (v2.tg?.urgent?.length) {
    for (const item of v2.tg.urgent) {
      if (item?.text) item.text = await translateOne(item.text);
    }
  }

  if (v2.tg?.topPosts?.length) {
    for (const item of v2.tg.topPosts) {
      if (item?.text) item.text = await translateOne(item.text);
    }
  }

  if (Array.isArray(v2.tSignals)) {
    for (const s of v2.tSignals) {
      if (s?.text) s.text = await translateOne(s.text);
      if (s?.headline) s.headline = await translateOne(s.headline);
      if (s?.summary) s.summary = await translateOne(s.summary);
    }
  }

  return v2;
}
