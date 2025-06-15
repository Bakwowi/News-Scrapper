from fastapi import FastAPI
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
import feedparser

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://127.0.0.1:5500",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sources = []
source_names = []

@app.get("/")
def read_root():
    return {"message": "Hi 👋 from News Scrapper's server"}

@app.get("/sources")
def fetch_all_news_sources():
    try:
        import os
        file_path = os.path.join(os.path.dirname(__file__), "sources.json")
        global sources
        with open(file_path, "r") as file:
            sources = json.load(file)
        global source_names
        source_names = []
        for i in sources:
            source_names.append(i.get("name", ""))
        return source_names
    except FileNotFoundError:
        return {"error": "sources.json file not found."}
    except json.JSONDecodeError:
        return {"error": "Error decoding JSON from sources.json."}
    except Exception as e:
        return {"error": f"An unexpected error occurred: {str(e)}"}



@app.get("/sources/{source}")
def fetch_data_from_source(source: str):
    url = ""
    for i in sources:
        if i["name"] == source:
            url = i["url"]
    
    feed = feedparser.parse(url)
    data = []
    for entry in feed.entries:
        data.append({
            "Title": entry.title,
            "Link": entry.link,
            "Published": entry.get('published', 'N/A'),
            "Summary": entry.get('summary', 'No summary')
        })
    return data
        

