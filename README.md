# BigQuery Release Pulse 🚀

Bilingual documentation / 双语技术文档

*   [🇬🇧 English](#-english)
*   [🇨🇳 简体中文](#-简体中文)

---

## 🇬🇧 English

A premium, highly interactive dashboard application designed for Google Cloud BigQuery developers and advocates. It fetches the latest official BigQuery Release Notes, parses them into standalone update cards, and offers powerful search, categorization, and one-click X (Twitter) draft generation and sharing.

### 🌟 Key Features
*   **Real-Time Feed Syncing**: Fetches the official Google Cloud BigQuery Atom feed directly.
*   **Granular Update Parsing**: Backends split daily multi-update logs using `<h3>` tags into separate, clean cards.
*   **High-Performance Cache**: Implements a 5-minute file cache (`feed_cache.json`) to minimize official endpoint hits and ensure speed.
*   **Client-Side Instant Filtering**: Match keyword queries instantly and filter by update type (Features, Changes, Issues, Announcements, Breaking).
*   **Dynamic Language Switcher**: Switch UI texts between English (EN) and Chinese (中文) instantly with a toggle button.
*   **X/Twitter Draft Composer**: Emojis, character limit checking (280 characters), and direct sharing intents.
*   **Premium Glassmorphism Design**: Outfit & Inter typography, dark neon theme, skeleton loading screens, and CSS animations.

### 🛠️ Technology Stack
*   **Backend**: Python 3.9+ / Flask / Requests
*   **Frontend**: HTML5 / Vanilla CSS3 (custom variables, grid, flexbox) / ES6+ JavaScript (Fetch API)

### 📂 Project Directory Structure
```text
bigquery_release_notes/
├── app.py               # Flask backend for feed syncing, parser engine, and cache
├── feed_cache.json      # Auto-generated local cache data (git-ignored)
├── .gitignore           # File exclusion mapping
├── README.md            # Bilingual project documentation
├── templates/
│   └── index.html       # Single-page HTML skeleton and tweet modal overlay
└── static/
    ├── app.js           # Client-side routing, translations, filters, and tweet builder
    └── style.css        # Premium stylesheets and responsive layout adjustments
```

### ⚡ Quick Start
1. **Activate Directory**: `cd bigquery_release_notes`
2. **Setup venv**: `python3 -m venv venv && source venv/bin/activate`
3. **Install Dependencies**: `pip install flask requests`
4. **Start Server**: `python3 app.py` (App binds to port `5001` to avoid macOS AirPlay conflicts).
5. **Visit Site**: **[http://localhost:5001](http://localhost:5001)**

---

## 🇨🇳 简体中文

这是一款专为 Google Cloud BigQuery 开发者与技术布道师设计的发布日志追踪与推文生成 Web 应用程序。它拉取最新的 BigQuery 官方 Release Notes，智能拆分为独立的更新卡片，并提供搜索、过滤以及一键生成并分享至 X (Twitter) 的强大交互功能。

### 🌟 核心功能
*   **实时数据同步**：直接获取 Google Cloud BigQuery 官方 Atom 订阅源。
*   **多维度拆分解析**：后端自动通过正则定位 `<h3>` 标识，将单日多条日志拆分为独立更新卡片。
*   **智能缓存机制**：5 分钟本地文件级缓存 (`feed_cache.json`)，加速载入并支持手动点击强制同步。
*   **客户端动态筛选**：支持即时搜索关键词和分类过滤标签（新功能、变更、问题、公告、重大变更）。
*   **双语一键切换**：顶栏原生语言切换（EN / 中文），零延迟无刷新翻译整个 UI 文本及推文前缀。
*   **推文草稿编辑器**：自动适配类型 Emoji，280 字符长度实时校验警示，一键复制代码或跳转 X 平台发布。
*   **极客感深色美学**：Outfit (标题) & Inter (正文) 字体体系，毛玻璃质感面板，渐变霓虹光圈及闪烁骨架屏载入效果。

### 🛠️ 技术栈
*   **后端**：Python 3.9+ / Flask / Requests
*   **前端**：HTML5 / 原生 CSS3 (CSS 变量、Grid、Flexbox 布局) / 原生 JavaScript (ES6 Fetch, 异步状态管理)

### 📂 项目目录树
```text
bigquery_release_notes/
├── app.py               # Flask 后端，提供 API 服务、XML 解析及本地缓存
├── feed_cache.json      # 本地缓存文件 (已在 .gitignore 中忽略)
├── .gitignore           # 忽略 venv、缓存文件及编辑配置
├── README.md            # 双语项目说明文档
├── templates/
│   └── index.html       # 前端页面骨架与 Tweet 弹窗组件
└── static/
    ├── app.js           # 客户端交互、双语切换、推文生成及过滤器
    └── style.css        # 现代化深色毛玻璃主题及动效样式
```

### ⚡ 快速开始
1. **进入目录**：`cd bigquery_release_notes`
2. **初始化环境**：`python3 -m venv venv && source venv/bin/activate`
3. **安装依赖**：`pip install flask requests`
4. **运行服务**：`python3 app.py`（服务将在本地端口 `5001` 启动运行，防止被 macOS 系统服务占用）。
5. **浏览器访问**：**[http://localhost:5001](http://localhost:5001)**
