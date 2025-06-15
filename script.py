from fastapi import FastAPI
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Hi 👋 from News Scrapper's server"}

@app.get("/sources")
def read_item():
    try:
        with open("sources.json", "r") as file:
            sources = json.load(file)
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

print("hi from the server")
