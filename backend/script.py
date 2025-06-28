from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from threading import Thread, Lock
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://127.0.0.1:5500",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

lock = Lock()

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


def getSourceName(link):
    for i in sources:
        if link == i["url"]:
            return i["name"]

@app.get("/sources/{source}")
def fetch_data_from_source(source: str):
    if source != "All Sources":
        try:
            url = ""
            for i in sources:
                if i.get("name", "") == source:
                    url = i.get("url", "")
                    break

            if not url:
                return {"error": f"Source '{source}' not found or URL missing."}

            feed = feedparser.parse(url)
            # if feed.bozo:
            #     return {"error": f"Failed to parse feed: {getattr(feed, 'bozo_exception', 'Unknown error')}"}

            data = []
            for entry in feed.entries:
                data.append({
                    "Title": getattr(entry, "title", "No title"),
                    "Link": getSourceName(url),
                    "Published": entry.get('published', 'N/A') if hasattr(entry, 'get') else getattr(entry, "published", "N/A"),
                    "Summary": entry.get('summary', 'No summary') if hasattr(entry, 'get') else getattr(entry, "summary", "No summary")
                })
            return data
        except Exception as e:
            return {"error": f"An unexpected error occurred: {str(e)}"}
    
    else:
        try:
            data = []

            def getData(url):
                feed = feedparser.parse(url)
                # if feed.bozo:
                #     return
                for entry in feed.entries:
                    with lock:
                        data.append({
                            "Title": getattr(entry, "title", "No title"),
                            "Link": getSourceName(url),
                            "Published": entry.get('published', 'N/A') if hasattr(entry, 'get') else getattr(entry, "published", "N/A"),
                            "Summary": entry.get('summary', 'No summary') if hasattr(entry, 'get') else getattr(entry, "summary", "No summary")
                        })

            threads = []
            for i in sources:
                url = i.get("url", "")
                if url:
                    thread = Thread(target=getData, args=(url,))
                    threads.append(thread)
                    thread.start()
            for thread in threads:
                thread.join()

            return data


        except Exception as e:
            return {"error": f"An unexpected error occurred: {str(e)}"}

        


class Source(BaseModel):
    name: str
    url: str

@app.post("/sources")
async def add_new_source(source: Source):
    try:
        file_path = os.path.join(os.path.dirname(__file__), "sources.json")
        global sources
        for i in sources:
            if source.name == i.get("name", ""):
                return {"message": "This source already exists"}
        # Add new source
        sources.insert(1, {"name": source.name, "url": source.url})
        with open(file_path, "w") as file:
            json.dump(sources, file, indent=4)
        return {"message": "Source added successfully.", "source": {"name": source.name, "url": source.url}}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"An unexpected error occurred: {str(e)}"})


@app.delete("/sources/{source_name}")
def delete_source(source_name: str):
    global sources, source_names
    # Find and remove the source by name
    sources = [s for s in sources if s.get("name", "") != source_name]
    source_names = [name for name in source_names if name != source_name]
    file_path = os.path.join(os.path.dirname(__file__), "sources.json")
    try:
        with open(file_path, "w") as file:
            json.dump(sources, file, indent=4)
        return {"message": f"Source '{source_name}' deleted successfully.", "sources": source_names}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"An unexpected error occurred: {str(e)}"})