# Crucix 中文快速版

基于 Crucix 思路的快速上线版本，优先覆盖：
- 加密货币
- 黄金/原油期货
- 美股
- A股
- 地缘情报
- 供应链情报
- 行业情报
- Telegram 告警

## 1. 安装

```bash
npm install
```

## 2. 配置

复制 `.env.example` 为 `.env`，填写 Telegram 配置：

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

可选：
- `ALERT_THRESHOLD_PERCENT`（默认 1.2）
- `REFRESH_MINUTES`（默认 15）

## 3. 启动

```bash
npm run dev
```

打开：`http://localhost:3117`

## 4. API

- `GET /api/data` 当前数据
- `GET /api/health` 健康状态

## 说明

这是先可用的快速版，后续可以继续升级：
- 接入更多数据源（例如更专业的 A 股行情、地缘事件库）
- 增加筛选、打分、风险等级
- 增加 Telegram 指令交互（/brief /status /sweep）
