/**
 * Fetches Bart Bash data from a Google Sheet to be displayed in an HTML datatable. (0.06)
 *
 * @author Austin deHaan & ChatGPT
 */
const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4DZLR5OHCS6HwuxB-LuCigA4kJbvyDKyn4OvC1xotc989I6tVABOlKRsAQeWaeQeU53O-xra0Bag1/pub?gid=1494529939&single=true&output=csv";

fetch(sheetURL)
  .then((response) => response.text())
  .then((data) => {
    const rows = data.split("\n").map((row) => row.split(","));

    // Table references
    const thead = document.querySelector(".sheetTable thead");
    const tbody = document.querySelector(".sheetTable tbody");

    // Create header row
    let headerHTML = "<tr>";
    rows[0].forEach((header) => {
      headerHTML += `<th>${header.trim()} <i class="fa-solid fa-sort"></i>`;
    });
    headerHTML += "</tr>";
    thead.innerHTML = headerHTML;

    // Create table body rows
    for (let i = 1; i < rows.length; i++) {
      let rowHTML = "<tr>";
      rows[i].forEach((cell) => {
        rowHTML += `<td>${cell.trim()}</td>`;
      });
      rowHTML += "</tr>";
      tbody.innerHTML += rowHTML;
    }

    // ---- Add Bart images inside first column of top 3 ----
    const medalImages = [
      "../imgs/sbartg.png", // 1st place
      "../imgs/sbartc.png", // 2nd place
      "../imgs/gwbart.png", // 3rd place
    ];

    const tableRows = tbody.querySelectorAll("tr");
    tableRows.forEach((row, index) => {
      if (index < 3) {
        // Top 3 only
        const firstCell = row.querySelector("td");
        if (firstCell) {
          const img = document.createElement("img");
          img.src = medalImages[index];
          img.alt = `${index + 1} place`;
          img.classList.add("medal-icon");

          // Insert image before the text in the cell
          firstCell.prepend(img);
        }
      }
    });
  })
  .catch((error) => console.error("Error fetching Google Sheet data:", error));

// search bar
document.addEventListener("DOMContentLoaded", () => {
  const filterInput = document.getElementById("filterInput");
  const filterBtn = document.getElementById("filterBtn");
  const table = document.querySelector(".sheetTable");

  filterBtn.addEventListener("click", () => {
    const filter = filterInput.value.toLowerCase();
    const rows = table.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(filter) ? "" : "none";
    });
  });
});

// individual column sorting
document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector(".sheetTable");

  const observer = new MutationObserver(() => {
    const thead = table.querySelector("thead");
    if (!thead || thead.rows.length === 0) return;

    // Prevent adding listeners twice
    if (thead.querySelector("th[data-sortable]")) return;

    const headers = thead.rows[0].cells;

    Array.from(headers).forEach((header, index) => {
      header.style.cursor = "pointer";
      header.setAttribute("data-sortable", "true");

      // Default sort direction: true = low→high, false = high→low
      let sortAsc = index === headers.length - 1 ? false : true;

      header.addEventListener("click", () => {
        sortTableByColumn(table, index, sortAsc);
        // Toggle on next click
        sortAsc = !sortAsc;
      });
    });
  });

  observer.observe(table.querySelector("thead"), { childList: true });

  function sortTableByColumn(table, colIndex, asc = true) {
    const tbody = table.querySelector("tbody");
    const rowsArray = Array.from(tbody.querySelectorAll("tr"));

    rowsArray.sort((a, b) => {
      let aText = a.cells[colIndex].innerText.trim();
      let bText = b.cells[colIndex].innerText.trim();

      // Handle numbers vs text
      let aVal = parseFloat(aText.replace(/,/g, "")) || aText.toLowerCase();
      let bVal = parseFloat(bText.replace(/,/g, "")) || bText.toLowerCase();

      if (aVal < bVal) return asc ? -1 : 1;
      if (aVal > bVal) return asc ? 1 : -1;
      return 0;
    });

    rowsArray.forEach((row) => tbody.appendChild(row));
  }
});
