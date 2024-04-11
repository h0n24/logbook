// TODO: needs major refactor
// schedulePage

function hideRowsWithEmptyContent() {
  const table = document.querySelector(
    ".schedule_table tbody"
  ) as HTMLTableElement;
  if (!table) return;

  // add default class to table
  table.classList.add("hide-empty-rows");

  // detect if empty
  const rows = table.querySelectorAll("tr");
  let allRowsEmpty = true;

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    let isEmpty = true;

    cells.forEach((cell) => {
      // if cell has class para, then skip
      if (cell.classList.contains("para")) return;

      if (cell.innerText.trim() !== "") {
        isEmpty = false;
        allRowsEmpty = false;
      }
    });

    if (isEmpty) {
      // add class instead
      row.classList.add("hidden-row");
    } else {
      row.classList.remove("hidden-row");
    }
  });

  const allEmptyRowElement = document.querySelector(
    "#if-all-empty-row"
  ) as HTMLElement;
  if (allRowsEmpty) {
    if (allEmptyRowElement === null) {
      const newRow = document.createElement("tr");
      newRow.id = "if-all-empty-row";
      const newCell = document.createElement("td");
      newCell.classList.add("para");
      newCell.colSpan = 8;
      newCell.innerText = "V tomto týdnu nemáte žádné lekce.";
      newRow.appendChild(newCell);
      table.appendChild(newRow);
    } else {
      allEmptyRowElement.style.visibility = "visible";
    }
  } else {
    // hide element via style
    if (allEmptyRowElement) {
      allEmptyRowElement.style.visibility = "hidden";
    }
  }

  // create row with td with checkbox element
  const newDiv = document.createElement("div");
  newDiv.classList.add("hide-empty-rows-wrapper");

  // create checkbox element
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "hideEmptyRows";
  checkbox.checked = true;
  checkbox.addEventListener("change", function () {
    const isChecked = (this as HTMLInputElement).checked;
    const rows = table.querySelectorAll("tr");
    rows.forEach((row) => {
      if (isChecked) {
        table.classList.add("hide-empty-rows");
      } else {
        table.classList.remove("hide-empty-rows");
      }
    });
  });

  // create label element
  const label = document.createElement("label");
  label.htmlFor = "hideEmptyRows";
  label.innerText = "Skrýt řádky bez obsahu";

  // check if exists
  const existingCheckbox = document.querySelector("#hideEmptyRows");

  // do not add if already exists
  if (existingCheckbox) return;

  // append elements
  newDiv.appendChild(checkbox);
  newDiv.appendChild(label);
  const tableWrapper = document.querySelector(".table-wrapper") as HTMLElement;
  tableWrapper.insertBefore(newDiv, tableWrapper.firstChild);
}

// add right click to menu
export function scheduleEnhancements(state) {
  if (state !== "schedulePage") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // alert("schedule");

      // detect if table changes its data
      const observer = new MutationObserver(function (mutations) {
        hideRowsWithEmptyContent();
      });

      const table = document.querySelector(
        ".schedule_table tbody"
      ) as HTMLElement;
      observer.observe(table, {
        childList: true,
      });

      // hide rows with empty content (default)
      hideRowsWithEmptyContent();
    } catch (error) {}
  }, 100);
}
