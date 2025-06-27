const searchInput = document.getElementById("search-news-input");
const searchButton = document.getElementById("search-button");

const sourceNameInput = document.getElementById("input-source-name");
const sourceUrlInput = document.getElementById("input-source-url");
const addNewSourceBtn = document.getElementById("add-new-source");

const sourceContainer = document.querySelector(".sources");
// const sources = document.querySelectorAll(".sources .source");

const exportCVS = document.getElementById("export-cvs");
const exportJSON = document.getElementById("export-JSON");

const dialogBox = document.getElementById("dialog-box");

let headlines = [];

const outputToDialogBox = (message, type) => {
  if (type == "danger") {
    dialogBox.textContent = message;
    if (!dialogBox.classList.contains("danger")) {
      dialogBox.classList.add("danger");
    }
  } else if (type == "success") {
    dialogBox.textContent = message;
    if (dialogBox.classList.contains("danger")) {
      dialogBox.classList.remove("danger");
    }
  }
};

const AddSourceEventListener = () => {
  const sources = document.querySelectorAll(".sources .source");
  sources.forEach((source) => {
    source.addEventListener("click", async () => {
      // e.preventDefault();
      console.log("hi there");

      try {
        outputToDialogBox("Fetching headlines.... ", "success");

        const response = await fetch(
          `http://127.0.0.1:8000/sources/${source.textContent}`,
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
        console.log(headlines);
        const cardsContainer = document.querySelector(".news-cards");
        cardsContainer.innerHTML = "";
        if (headlines.length === 0) {
          console.log("there are no headlines");
          cardsContainer.innerHTML = "No headlines found for this source.";
          // outputToDialogBox("")
        } else {
          // console.log(headlines);
          cardsContainer.innerHTML += headlines
          .map((item) => {
              return `
                 <div class="card autoshow">
                <h1>
                  ${item.Title}
                </h1>
                <p>
                 ${item.Summary}
                </p>
                <div class="info">
                <span>${item.Published}</span>
                <span>${source.textContent}</span>
                </div>
              </div>`;
            })
            .join("");
        }
        outputToDialogBox(
          `${headlines.length} headlines have been successfully fetched`,
          "success"
        );
      } catch (error) {
        outputToDialogBox("Error fetching source headlines", "danger");
        console.error("Error fetching source headlines", error);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    outputToDialogBox(data.message, "success");
    try {
      const response = await fetch("http://127.0.0.1:8000/sources", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      sourceContainer.innerHTML +=
        data
          .map((source) => {
            return `<button class="source">${source}</button>`;
          })
          .join("") +
        `<button class="source" id="add-source-btn-2"><svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#ffffff"
                    stroke="#ffffff"
                    width="20"
                    height="20"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <title></title>
                      <g id="Complete">
                        <g data-name="add" id="add-2">
                          <g>
                            <line
                              fill="none"
                              stroke="#ffffff"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              x1="12"
                              x2="12"
                              y1="19"
                              y2="5"
                            ></line>
                            <line
                              fill="none"
                              stroke="#ffffff"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              x1="5"
                              x2="19"
                              y1="12"
                              y2="12"
                            ></line>
                          </g>
                        </g>
                      </g>
                    </g>
                  </svg>
                  Add source</button>`;
      console.log(data);
      AddSourceEventListener();
    } catch (error) {
      console.error("Error fetching sources:", error);
      outputToDialogBox("Error fetching sources", "danger");
    }
  } catch (error) {
    console.error("Error connecting to the server:", error);
    outputToDialogBox("Error connecting to the server", "danger");
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
  try {
    if (headlines.length < 1) {
      outputToDialogBox(
        "No headlines to export. Fetch headlines first",
        "danger"
      );
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

    outputToDialogBox(
      "The headlines have been successfully exported to 'Headlines.csv'",
      "success"
    );
    console.log(
      "The headlines have been successfully exported to 'Headlines.csv'"
    );
  } catch (error) {
    outputToDialogBox("Error exporting headlines to CSV", "danger");
    console.error("Error exporting headlines to CSV", error);
  }
});

exportJSON.addEventListener("click", (e) => {
  try {
    if (headlines.length < 1) {
      outputToDialogBox(
        "No headlines to export. Fetch headlines first",
        "danger"
      );
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

    outputToDialogBox(
      "The headlines have been successfully exported into a JSON file",
      "success"
    );
    console.log(
      "The headlines have been successfully exported into a JSON file"
    );
  } catch (error) {
    outputToDialogBox("Error exporting headlines to JSON", "danger");
    console.error("Error exporting headlines to JSON", error);
  }
});

const searchNews = (query) => {
  if (query.trim() == "") {
    outputToDialogBox("Please enter a query", "danger");
    console.error("Please enter a query");
    return;
  }
  if (headlines.length < 1) {
    outputToDialogBox(
      "No news to search from. Fetch headlines first",
      "danger"
    );
    console.error("No news to search from. Fetch headlines first");
    return;
  }
  let foundHeadlines = [];
  headlines.forEach((item) => {
    if (item.Title.toLowerCase().includes(query.toLowerCase())) {
      foundHeadlines.push(item);
    }
  });

  tableBody.innerHTML = "";
  if (foundHeadlines.length > 0) {
    tableBody.innerHTML += foundHeadlines
      .map((item) => {
        return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`;
      })
      .join("");
    outputToDialogBox(
      `${foundHeadlines.length} headline(s) found for "${query}"`,
      "success"
    );
  } else {
    tableBody.innerHTML += headlines
      .map((item) => {
        return `<tr>
                        <td>${item.Title}</td>
                        <td>${item.Link}</td>
                        <td>${item.Published}</td>
                    </tr>`;
      })
      .join("");
    outputToDialogBox(
      `No headlines found for "${query}". Showing all headlines.`,
      "danger"
    );
    console.log("No headlines found");
  }
  return console.log("Search triggered => ", searchInput.value);
};


