const selectSource = document.getElementById("select-source");
const fetchNewsButton = document.getElementById("fetch-news");
const searchInput = document.getElementById("search-news-input");
const searchButton = document.getElementById("search-button");
const exportCVS = document.getElementById("export-cvs");
const exportJSON = document.getElementById("export-JSON");



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
            console.error("Error fetching data:", error);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});

selectSource.addEventListener("change", (e) => {
    console.log("selected source => ", e.target.value)
});

fetchNewsButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(e.target.textContent, " => ", selectSource.value);
});

// If you want to handle pressing Enter in the input:
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchNews();
    }
});

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    searchNews();
});

exportCVS.addEventListener("click", (e) => {
    console.log(e.target.textContent);
});

exportJSON.addEventListener("click", (e) => {
    console.log(e.target.textContent);
});

const searchNews = () => {
    return console.log("Search triggered => ", searchInput.value);
};
