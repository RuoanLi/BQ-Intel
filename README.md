# BigQuery Release Pulse 🚀

一个专为 Google Cloud BigQuery 开发者与布道师设计的发布日志追踪与推文生成 Web 应用程序。它能拉取最新的 BigQuery 官方 Release Notes，智能拆分为独立的更新卡片，并提供搜索、过滤以及一键生成/发布 X (Twitter) 推文的强大交互功能。

---

## 🌟 核心功能

*   **实时数据同步 (Feed Ingestion)**：直接获取 Google Cloud BigQuery 官方 Atom 订阅源。
*   **多维度拆分解析**：攻克了官方 Feed 将单日多条不同类型的日志合并在同一个节点内的弊端。后端自动通过正则定位 `<h3>` 标识，打散重组为单条卡片。
*   **智能缓存机制**：5 分钟本地文件级缓存 (`feed_cache.json`)，避免高频请求官方服务，提供极致的页面加载速度，同时支持前端手动点击 Refresh 强制同步。
*   **客户端动态筛选**：
    *   **关键词搜索**：即时响应关键字匹配（正文、日期、类型）。
    *   **分类过滤**：点击顶部数值卡片或过滤标签，瞬间过滤 Feature、Change、Issue、Announcement、Breaking 等类型的更新。
*   **拟真推文草稿编辑器**：
    *   根据更新类型自动匹配主题 Emoji (如 🚀, 📢, 🚨)。
    *   智能控制字数，确保加上原始文档链接后整条推文严格控制在 **280字符以内**。
    *   实时字数计数与溢出警告。
    *   一键复制草稿或直接拉起官方 X 网页端发布界面 (`twitter/intent`)。
*   **极客感深色美学设计**：
    *   采用 **Outfit** (标题) 与 **Inter** (正文) 现代化字体体系。
    *   毛玻璃视效面板 (`backdrop-filter`) 与极具科技感的呼吸指示灯、背景渐变霓虹光圈。
    *   CSS 骨架屏载入效果与平滑的过渡微动画。

---

## 🛠️ 技术栈

*   **后端 (Backend)**：Python 3.9+ / Flask / Requests (无额外臃肿的 RSS 解析依赖，完全使用轻量级 ElementTree 精准提取)
*   **前端 (Frontend)**：HTML5 语义化结构 / Vanilla CSS3 (原生 CSS 变量、Grid、Flexbox、自适应布局) / 纯原生 JavaScript (ES6 Fetch, 异步状态管理)
*   **图标系统**：嵌入式 SVG (免网络请求，免引入第三方图标库，性能卓越)

---

## 📂 项目结构

```text
bigquery_release_notes/
├── app.py               # Flask 后端核心，提供 API 服务、XML 解析及本地缓存
├── feed_cache.json      # 运行期间自动生成的本地缓存文件 (已在 .gitignore 中忽略)
├── .gitignore           # 忽略 venv、缓存文件及 IDE 配置文件
├── README.md            # 本项目说明文档
├── templates/
│   └── index.html       # 语义化前端页面骨架与 Tweet 弹窗组件
└── static/
    ├── app.js           # 客户端交互、状态更新、推文自适应裁剪及事件监听
    └── style.css        # 现代化深色毛玻璃主题及动效样式
```

---

## ⚡ 快速开始

### 1. 克隆/定位项目目录
首先确保进入项目目录：
```bash
cd bigquery_release_notes
```

### 2. 初始化虚拟环境并安装依赖
```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境 (macOS/Linux)
source venv/bin/activate

# 安装依赖包
pip install flask requests
```

### 3. 运行 Web 服务器
```bash
python3 app.py
```
默认情况下，Flask 服务将在本地端口 `5001` 启动运行，以规避 macOS 控制中心默认占用 5000 端口的问题。

### 4. 浏览器访问
在浏览器中打开：
👉 **[http://localhost:5001](http://localhost:5001)**

---

## 🔒 许可证

本项目基于 MIT 许可证开源。
