const selectSource = document.getElementById("select-source");
const fetchNewsButton = document.getElementById("fetch-news");
const searchInput = document.getElementById("search-news-input");
const searchButton = document.getElementById("search-button");
const exportCVS = document.getElementById("export-cvs");
const exportJSON = document.getElementById("export-JSON");
const tableBody = document.getElementById("table-body");

let news = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        console.log(data);

        try {
            const response = await fetch("http://127.0.0.1:8000/sources", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            selectSource.innerHTML += data.map(source => {
                return `<option value="${source}">${source}</option>`;
            }).join('');
            console.log(data);
        } catch (error) {
            console.error("Error fetching sources:", error);
        }
    } catch (error) {
        console.error("Error connecting to the server:", error);
    }
});

selectSource.addEventListener("change", (e) => {
    console.log("selected source => ", e.target.value)
});

fetchNewsButton.addEventListener("click", async (e) => {
    e.preventDefault();
    
    if(selectSource.value.trim() == ""){
        console.error("Please select a source");
        return
    }

    try{
    const response = await fetch(`http://127.0.0.1:8000/sources/${selectSource.value}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    data = await response.json();
    news = []
    news = data

    tableBody.innerHTML = ""
    tableBody.innerHTML += news.map(item => {
        return `<tr>
                    <td>${item.Title}</td>
                    <td>${item.Link}</td>
                    <td>${item.Published}</td>
                </tr>`
    }).join('')
    console.log(data);
    }
    catch(error) {
        console.error("Error fetching source news", error);
    }
});

// If you want to handle pressing Enter in the input:
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchNews(searchInput.value);
    }
});

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchNews(searchInput.value);
});

exportCVS.addEventListener("click", (e) => {
    console.log(e.target.textContent);
});

exportJSON.addEventListener("click", (e) => {
    console.log(e.target.textContent);
});

const searchNews = (query) => {
    if(query.trim() == ""){
        console.error("Please enter a query")
        return
    }
    if(news.length < 1){
        console.error("No news to search from. Search news first");
        return
    }
    let foundNews = []
    news.forEach((item, index) => {
        if(item.Title.toLowerCase().includes(query.toLowerCase())){
            foundNews.push(item);
        };
    });
    
    if(foundNews.length > 0){
        tableBody.innerHTML = "";
        tableBody.innerHTML += foundNews.map(item => {
            return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`
        }).join('');
    }
    else{
        tableBody.innerHTML = "";
        tableBody.innerHTML += news.map(item => {
            return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`
        }).join('');
        console.log("No news found")
    }
    return console.log("Search triggered => ", searchInput.value);
};


let title = "The fujha;ri rfofia roioiraona knvljser;n ;arjrva;jrubefv ";

// console.log(title.toLowerCase().includes("the"));