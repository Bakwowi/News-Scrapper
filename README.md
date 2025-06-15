# 📰 NewsScraper

A simple web application that scrapes and displays the latest news headlines using Python for the backend and HTML, CSS, and JavaScript for the frontend.

---

## 📌 Features

- Fetches news from multiple sources using RSS feeds
- Python backend for scraping and serving JSON data
- Clean, responsive frontend with vanilla HTML, CSS, and JS
- Uses `fetch` API to load news dynamically
- Easily customizable and extensible

---

## 📁 Project Structure

news-scraper/
  backend/
	app.py          # Python backend (Flask or FastAPI)
	scraper.py      # Logic for fetching/parsing news feeds
	sources.json    # List of RSS feed URLs
  frontend/
	index.html      # Main frontend page
	styles.css      # CSS styles
	script.js       # JavaScript to fetch/display news
  requirements.txt  # Python dependencies
  README.md         # Project documentation


---


## 🚀 Getting Started

### ✅ Prerequisites

- Python 3.7+
- pip (Python package manager)
- A modern browser

---

### ⚙️ Backend Setup (Python)

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/news-scraper.git
cd news-scraper/backend
