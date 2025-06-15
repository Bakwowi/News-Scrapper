const selectSource = document.getElementById("select-source");
const fetchNewsButton = document.getElementById("fetch-news");
const searchInput = document.getElementById("search-news-input");
const searchButton = document.getElementById("search-button");
const exportCVS = document.getElementById("export-cvs");
const exportJSON = document.getElementById("export-JSON");
const tableBody = document.getElementById("table-body");
const dialogBox = document.getElementById("dialog-box");

let headlines = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    // dialogBox.textContent = data.message;

    try {
      const response = await fetch("http://127.0.0.1:8000/sources", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      selectSource.innerHTML += data
        .map((source) => {
          return `<option value="${source}">${source}</option>`;
        })
        .join("");
      console.log(data);
    } catch (error) {
      console.error("Error fetching sources:", error);
    }
  } catch (error) {
    console.error("Error connecting to the server:", error);
  }
});

selectSource.addEventListener("change", (e) => {
  console.log("selected source => ", e.target.value);
});

fetchNewsButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (selectSource.value.trim() == "") {
    console.error("Please select a source");
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/sources/${selectSource.value}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    data = await response.json();
    headlines = [];
    headlines = data;

    tableBody.innerHTML = "";
    tableBody.innerHTML += headlines
      .map((item) => {
        return `<tr>
                    <td>${item.Title}</td>
                    <td>${item.Link}</td>
                    <td>${item.Published}</td>
                </tr>`;
      })
      .join("");
    console.log(data);
  } catch (error) {
    console.error("Error fetching source headlines", error);
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
  if (headlines.length < 1) {
    console.error("No headlines to export. Fetch headlines first");
    return;
  }

  const headers = Object.keys(headlines[0]).join(",");
  const rows = headlines.map((obj) => Object.values(obj).join(","));
  const csvData = [headers, ...rows].join("\n");

  const blob = new Blob([csvData], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "headlines.csv";
  a.click();
  URL.revokeObjectURL(url);
});

exportJSON.addEventListener("click", (e) => {
  if (headlines.length < 1) {
    console.error("No headlines to export. Fetch headlines first");
    return;
  }

  const jsonData = JSON.stringify(headlines, null, 4);

  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Headlines.json";
  a.click();
  URL.revokeObjectURL(url);
  console.log("The headlines have been successfully exported into a JSON file");
});

const searchNews = (query) => {
  if (query.trim() == "") {
    console.error("Please enter a query");
    return;
  }
  if (headlines.length < 1) {
    console.error("No news to search from. Search headlines first");
    return;
  }
  let foundHeadlines = [];
  headlines.forEach((item, index) => {
    if (item.Title.toLowerCase().includes(query.toLowerCase())) {
      foundHeadlines.push(item);
    }
  });

  if (foundHeadlines.length > 0) {
    tableBody.innerHTML = "";
    tableBody.innerHTML += foundHeadlines
      .map((item) => {
        return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`;
      })
      .join("");
  } else {
    tableBody.innerHTML = "";
    tableBody.innerHTML += headlines
      .map((item) => {
        return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`;
      })
      .join("");
    console.log("No headlines found");
  }
  return console.log("Search triggered => ", searchInput.value);
};

// let title = "The fujha;ri rfofia roioiraona knvljser;n ;arjrva;jrubefv ";

// console.log(title.toLowerCase().includes("the"));
