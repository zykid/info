const watchedAssets = [
  { key: "BTC-USD", name: "比特币", type: "crypto" },
  { key: "ETH-USD", name: "以太坊", type: "crypto" },
  { key: "GC=F", name: "黄金期货", type: "futures" },
  { key: "CL=F", name: "原油期货", type: "futures" },
  { key: "^GSPC", name: "标普500", type: "us" },
  { key: "^IXIC", name: "纳斯达克", type: "us" },
  { key: "AAPL", name: "苹果", type: "us" },
  { key: "TSLA", name: "特斯拉", type: "us" },
  { key: "000001.SS", name: "上证指数", type: "a" },
  { key: "399001.SZ", name: "深证成指", type: "a" }
];

const feeds = {
  geopolitical: [
    "https://feeds.reuters.com/reuters/worldNews",
    "https://www.aljazeera.com/xml/rss/all.xml"
  ],
  supplyChain: [
    "https://www.freightwaves.com/news/feed",
    "https://www.supplychaindive.com/feeds/news/"
  ],
  industryIntel: [
    "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    "https://techcrunch.com/feed/"
  ]
};

export { watchedAssets, feeds };
