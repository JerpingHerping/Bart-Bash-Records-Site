/**
 * Fetches Bart Bash data from a Google Sheet to be displayed in an HTML datatable.
 *
 * @author Austin deHaan & ChatGPT
 */
const sheetURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT4DZLR5OHCS6HwuxB-LuCigA4kJbvyDKyn4OvC1xotc989I6tVABOlKRsAQeWaeQeU53O-xra0Bag1/pub?gid=0&single=true&output=csv";

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
      headerHTML += `<th>${header.trim()}</th>`;
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
  })
  .catch((error) => console.error("Error fetching Google Sheet data:", error));
