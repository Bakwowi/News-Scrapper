# 📰 NewsScraper

A simple web application that scrapes and displays the latest news headlines using **Python** for the backend and **HTML/CSS/JavaScript** for the frontend.

---

## 📌 Features

- Scrapes news from multiple sources using RSS feeds
- Clean and responsive frontend interface
- Dynamic loading of news via `fetch` API
- Categorized or source-filtered headlines
- Modular and extensible architecture

---

## 📁 Project Structure

- `backend/`
  - `app.py` – Python backend using Flask or FastAPI
  - `scraper.py` – Logic for fetching/parsing news feeds
  - `sources.json` – List of RSS feed URLs or site info
- `frontend/`
  - `index.html` – Main frontend page
  - `styles.css` – Page styling
  - `script.js` – JavaScript for fetching/rendering news
- `requirements.txt` – Python dependencies
- `README.md` – Project documentation

---

## 🚀 Getting Started

### ✅ Prerequisites

- Python 3.7 or higher
- pip (Python package manager)
- A modern web browser

---

### ⚙️ Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/news-scraper.git
