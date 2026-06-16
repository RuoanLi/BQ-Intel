# BigQuery Release Pulse 🚀

A premium, highly interactive dashboard application designed for Google Cloud BigQuery developers and advocates. It fetches the latest official BigQuery Release Notes, parses them into standalone update cards, and offers powerful search, categorization, and one-click X (Twitter) draft generation and sharing.

---

## 🌟 Key Features

*   **Real-Time Feed Syncing**: Fetches the official Google Cloud BigQuery Atom feed directly.
*   **Granular Update Parsing**: Solves the limitation where the official feed aggregates multiple disparate updates under a single daily entry. The backend splits updates using `<h3>` markers into separate, clean cards.
*   **High-Performance In-Memory Cache**: Implements a 5-minute file-based cache (`feed_cache.json`) to minimize official endpoint hits, ensuring instantaneous load times. Supports manual force-refresh.
*   **Client-Side Instant Filtering**:
    *   **Keyword Search**: Instantly matches queries against card content, dates, and types.
    *   **Category Toggles**: Click top stat cards or category chips to filter features, changes, issues, announcements, or breaking changes instantly.
*   **Immersive Tweet Draft Composer**:
    *   Auto-assigns relevant emojis (🚀, 📢, 🚨) based on update categories.
    *   Smart character controller clips draft bodies dynamically to fit within X's **280-character limit** alongside links.
    *   Real-time length checks and overflow indicators.
    *   One-click text copy or direct post intent launching.
*   **Futuristic Cyberpunk Aesthetic**:
    *   Modern web typography using **Outfit** (Headers) and **Inter** (Body text).
    *   Translucent glassmorphism containers (`backdrop-filter`) with thin borders and neon glow backdrops.
    *   Keyframe loading skeleton cards, pulse status indicators, and rotate loading animations.

---

## 🛠️ Technology Stack

*   **Backend**: Python 3.9+ / Flask / Requests (no bulky RSS parser dependencies, utilizes built-in light `ElementTree` parsing).
*   **Frontend**: Semantic HTML5 / Vanilla CSS3 (CSS custom properties, Grid, Flexbox, Keyframes) / ES6+ JavaScript (Fetch API, asynchronous state controls).
*   **Asset System**: Inline SVG icons (self-contained, no external calls, high performance).

---

## 📂 Project Directory Structure

```text
bigquery_release_notes/
├── app.py               # Flask backend for feed syncing, parser engine, and cache
├── feed_cache.json      # Auto-generated local cache data (git-ignored)
├── .gitignore           # File exclusion mapping
├── README.md            # English project documentation
├── templates/
│   └── index.html       # Single-page HTML skeleton and tweet modal overlay
└── static/
    ├── app.js           # Client-side routing, filters, state, and tweet builder
    └── style.css        # Premium stylesheets and responsive layout adjustments
```

---

## ⚡ Quick Start

### 1. Position the Directory
Ensure you are in the project folder:
```bash
cd bigquery_release_notes
```

### 2. Setup Virtual Environment and Dependencies
```bash
# Initialize venv
python3 -m venv venv

# Activate venv (macOS/Linux)
source venv/bin/activate

# Install requirements
pip install flask requests
```

### 3. Start the Flask Server
```bash
python3 app.py
```
*Note: The Flask application binds to port `5001` by default to avoid conflicts with macOS AirPlay Receiver services.*

### 4. Open Application
Go to your browser of choice and visit:
👉 **[http://localhost:5001](http://localhost:5001)**

---

## 🔒 License

This project is open-sourced under the MIT License.
