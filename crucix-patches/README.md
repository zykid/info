# Crucix 中文化与自动翻译补丁

这个目录用于给原版 Crucix 打补丁（保留原版界面）。

## 1) 复制自动翻译模块

把 `crucix-patches/lib/auto-translate.mjs` 复制到原版项目：

- 目标路径：`lib/auto-translate.mjs`

## 2) 修改 `lib/i18n.mjs`

把：

```js
const SUPPORTED_LOCALES = ['en', 'fr'];
```

改成：

```js
const SUPPORTED_LOCALES = ['en', 'fr', 'zh'];
```

## 3) 创建中文语言文件

```bash
cp locales/en.json locales/zh.json
```

## 4) 修改 `dashboard/inject.mjs`

在 import 区加入：

```js
import { autoTranslateV2 } from '../lib/auto-translate.mjs';
```

在 `synthesize(data)` 函数中，把 `return V2;` 改成：

```js
const enableAutoTranslate = (process.env.CRUCIX_AUTO_TRANSLATE || '').toLowerCase() === 'true';
if (enableAutoTranslate) {
  await autoTranslateV2(V2, true);
}
return V2;
```

## 5) `.env` 增加配置

```env
CRUCIX_LANG=zh
CRUCIX_AUTO_TRANSLATE=true
```

并确保 Telegram:

```env
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## 6) 重启

```bash
docker compose down
docker compose up -d --build
```

## 7) 验证

```bash
docker compose logs --tail=100 | grep "\[i18n\] Language"
curl -s http://127.0.0.1:3117/api/data | jq '.newsFeed[0].headline, .tg.urgent[0].text'
```

看到中文输出即成功。
