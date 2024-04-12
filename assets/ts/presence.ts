import * as incl from "./_incl";

// TODO: refactor this file into separate files

const selectorForWorkInClass = ".wrapper-students thead tr th:nth-child(8)";
const titleTextNotRated = "Pozor: máte nepřidělené známky";
const titleTextNotDiamonds = "Pozor: máte nepřidělené diamanty";

function hideMarkPopup(event, popup) {
  // click outside
  setTimeout(() => {
    incl.clickOnPosition(event.clientX - 50, event.clientY);
    document.body.style.cursor = "default";
  }, 500);

  setTimeout(() => {
    // show popup after custom click
    popup.style.visibility = "visible";
    popup.style.zIndex = "";
    document.body.style.cursor = "default";
  }, 1000);
}

function set12Mark(event, popup) {
  // hide popup before clicking
  popup.style.visibility = "hidden";

  document.body.style.cursor = "wait";

  // make click for us
  const maxMark = popup.querySelector("md-option[value='12']") as HTMLElement;
  maxMark.click();

  // change z-index to don't block scroll
  popup.style.zIndex = "-1";

  hideMarkPopup(event, popup);
}

function addContextMenu(event): void {
  event.preventDefault();
  incl.clickOnPosition(event.clientX, event.clientY);

  const popupID = event.target.getAttribute("aria-owns");
  const isEnabled = event.target.getAttribute("aria-disabled") === "false";
  const popup = document.getElementById(popupID);

  if (popup && isEnabled) {
    set12Mark(event, popup);
  }
}

function whenClickedOnPresenceTh() {
  const workInClass: HTMLElement = document.querySelector(
    selectorForWorkInClass
  ) as HTMLElement;

  workInClass.title =
    "Pravé tlačítko: Dát maximální známku všem studentům. Pozor: trvá +1 sekundu za každého žáka.";

  workInClass.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    incl.showLoader();

    const classWorkSelects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    let iteration = 0;

    classWorkSelects.forEach((select, key, parent) => {
      const popupID = select.getAttribute("aria-owns") as string;
      const popup = document.getElementById(popupID) as HTMLElement;

      // skip if already selected
      try {
        const isAlreadySelected = select.querySelector(
          ".md-select-value .md-text"
        ) as HTMLElement;
        if (isAlreadySelected.innerHTML === "12") return;
      } catch (error) {}

      // click on select on our behalf
      setTimeout(() => {
        set12Mark(event, popup);
      }, key * 1000 + 1);

      // last iteration
      if (key === parent.length - 1) {
        setTimeout(() => {
          hideMarkPopup(event, popup);
        }, (key + 1) * 1000 + 500);
      }

      iteration = key + 1;
    });

    setTimeout(() => incl.hideLoader(), iteration * 1000 + 2);
  });
}

function addContextMenuForEachSelect() {
  try {
    const selects = document.querySelectorAll(".presentr-classWork md-select");

    selects.forEach((select) => {
      select.addEventListener("contextmenu", addContextMenu);

      (select as HTMLElement).title =
        "Levé tlačítko: Otevřít — Pravé tlačítko: Dát maximální známku";
    });
  } catch (error) {}
}

function countPresentStudents() {
  const students = document.querySelectorAll(
    ".wrapper-students tbody tr .presents"
  );

  let total = Object.keys(students).length;
  let totalStudents = total ? total : 0;
  let totalPresent = 0;

  students.forEach((student) => {
    const dots = student.querySelectorAll("span");

    let wasPresent = 0;

    dots.forEach((dot) => {
      const selection = dot.querySelector("i:last-child") as HTMLElement;

      if (selection.classList.contains("ng-hide")) return;
      if (selection.classList.contains("was-not")) return;

      wasPresent++;
    });

    totalPresent += wasPresent;
  });

  const thTotal = document.querySelector(
    ".wrapper-students thead .number"
  ) as HTMLElement;

  thTotal.innerHTML = `${totalPresent}/${totalStudents}`;
  thTotal.title = "Celkový počet přítomných / celkový počet studentů";
}

function whenPresenceChanged() {
  const presenceButtons = document.querySelectorAll(".presents > span");

  presenceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setTimeout(() => countPresentStudents(), 250);
    });
  });
}

function hideMaterialsWhenNoTeacher(isTeacher) {
  const addMaterial: HTMLDivElement = document.querySelector(
    ".add-material"
  ) as HTMLDivElement;

  if (isTeacher) {
    // addMaterial.style.display = "inline-block";
    addMaterial.style.transitionDuration = "0.3s";
    addMaterial.style.opacity = "1";
    addMaterial.style.zIndex = "auto";
  } else {
    // addMaterial.style.display = "none";
    addMaterial.style.transitionDuration = "0s";
    addMaterial.style.zIndex = "-1";
    addMaterial.style.opacity = "0";
  }
}

function whenTeacherRoleChanged() {
  const teacherRole = document.querySelectorAll(
    ".teacherInit .check-techers input"
  );

  let selected = false;
  teacherRole.forEach((input) => {
    if ((input as HTMLInputElement).checked) {
      selected = true;
    }
  });

  hideMaterialsWhenNoTeacher(selected);
}

function removeActiveTabs() {
  const tabs = document.querySelectorAll(".presents ul.pars li");

  tabs.forEach((tab) => {
    if (tab.classList.contains("active")) {
      tab.classList.remove("active");
    }
  });
}

// opravuje chybu, kdy se "zaškrtne" i když není studentů
function correctBugTabsActiveWhenBreak() {
  // find if there is a break
  const breakSelector =
    "body > main > div:nth-child(4) > div > div.interna-wrap > div:nth-child(2) > h3";
  const targetBreakText = "Máte přestávku nebo momentálně neprobíhá hodina";

  const breakElement = document.querySelector(breakSelector);
  if (!breakElement) return;
  if (!breakElement.innerHTML.includes(targetBreakText)) return;

  // check if its currently visible on screen
  const observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting === true) {
        // console.log("Element is fully visible in screen");
        removeActiveTabs();
      }
    },
    { threshold: [1] }
  );

  observer.observe(breakElement);
}

function automaticallySelectOnlineForOnlineGroups() {
  const groupName = document.querySelector(".groupName") as HTMLElement;
  const groupNameText = groupName.textContent as string;
  if (groupNameText.includes("JAO")) {
    // automatically set student as online to every online group
    const mainCheckbox = document.querySelector(
      "#isAllOnline"
    ) as HTMLInputElement;
    if (mainCheckbox) {
      if (!mainCheckbox.checked) {
        try {
          const checkboxes = document.querySelectorAll(
            ".presents-online input[type='checkbox']"
          );
          checkboxes.forEach((checkbox) => {
            // set every checkbox to checked
            if (!(checkbox as HTMLInputElement).checked) {
              // simulate click
              (checkbox as HTMLElement).click();
            }
          });

          mainCheckbox.checked = true;
        } catch (error) {
          console.error("Error while setting online groups");
        }
      }
    }

    // add class hide-cell-online to class .wrapper-students
    const wrapperStudents = document.querySelector(
      ".wrapper-students"
    ) as HTMLElement;

    if (wrapperStudents) {
      wrapperStudents.classList.add("hide-cells-online");
    }
  }
}

function detectIfNotDiamonds() {
  function detectDiamonds() {
    const diamondsElement = document.querySelector(
      ".diamonds .diamond"
    ) as HTMLElement;
    const activeTabElement = document.querySelector(
      ".presents .pars li.active"
    ) as HTMLElement;

    if (diamondsElement) {
      const diamonds = diamondsElement.textContent as string;

      if (diamonds == "5") {
        activeTabElement.classList.add("show-badge-diamonds");
        if (activeTabElement.title != titleTextNotRated) {
          activeTabElement.title = titleTextNotDiamonds;
        }
      } else {
        activeTabElement.classList.remove("show-badge-diamonds");
        if (activeTabElement.title == titleTextNotDiamonds) {
          activeTabElement.title = "";
        }
      }
    }
  }

  try {
    detectDiamonds();

    incl.debounce(detectIfNotDiamonds, 3000)();
  } catch (error) {}

  try {
    // when someone clicks on .awarded span then remove data-diamonds
    const awarded = document.querySelectorAll(".awarded span i");

    awarded.forEach((award) => {
      award.addEventListener("click", () => {
        // activeTabElement.removeAttribute("data-diamonds");
        incl.debounce(detectIfNotDiamonds, 3000)();
      });
    });
  } catch (error) {}
}

function detectIfNotRated() {
  const activeTabElement = document.querySelector(
    ".presents .pars li.active"
  ) as HTMLElement;

  try {
    // detect every md-select
    const selects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    // find if atleast one of those's innerHTML contains "-"
    // find element "md-select-value" and check if it contains "-"
    let isNotRated = false;
    selects.forEach((select) => {
      const selectValue = select.querySelector(
        ".md-select-value span"
      ) as HTMLElement;

      const selectValueText = selectValue?.textContent;

      if (selectValueText?.includes("-")) {
        isNotRated = true;
      }
    });

    if (isNotRated) {
      activeTabElement.classList.add("show-badge-work");
      activeTabElement.title = titleTextNotRated;
    } else {
      activeTabElement.classList.remove("show-badge-work");
      if (activeTabElement.title == titleTextNotRated) {
        activeTabElement.title = "";
      }
    }
  } catch (error) {}

  try {
    // when someone clicks on .presentr-classWork md-select[aria-disabled="false"]
    // then remove data-work
    const classWorkSelects = document.querySelectorAll(
      ".presentr-classWork md-input-container"
    );
    classWorkSelects.forEach((select) => {
      select.addEventListener("click", () => {
        incl.debounce(detectIfNotRated, 3000)();
      });
    });

    const classWorkSelects2 = document.querySelector(
      selectorForWorkInClass
    ) as HTMLElement;
    classWorkSelects2.addEventListener("click", () => {
      incl.debounce(detectIfNotRated, 3000)();
    });
  } catch (error) {}
}

function detectIfNotRatedOrDiamonds() {
  detectIfNotDiamonds();
  detectIfNotRated(); // needs to be after detectIfNotDiamonds, so title is set properly
}

function copyTableForPrinting() {
  // if exists, remove
  const tableCopyExists = document.querySelector("#print-table") as HTMLElement;
  if (tableCopyExists) {
    tableCopyExists.remove();
  }

  const table = document.querySelector(
    ".wrapper-students table"
  ) as HTMLElement;
  const tableCopy = table.cloneNode(true) as HTMLElement;
  tableCopy.id = "print-table";
  tableCopy.classList.add("print-table");

  // append new body to html with table
  const newBody = document.createElement("body");
  newBody.id = "print-table-body";

  // create new h1 with content of .groupName
  const h1 = document.createElement("h1");
  h1.classList.add("print-table-title");
  const groupName = document.querySelector(".groupName") as HTMLElement;
  h1.innerHTML = "Skupina: " + groupName.textContent;
  newBody.appendChild(h1);

  // create new h2 with content of .specName
  const h2 = document.createElement("h2");
  h2.classList.add("print-table-subtitle");
  const specName = document.querySelector(".specName") as HTMLElement;
  let specNameText = specName.textContent as string;
  specNameText = specNameText.replace("(", "");
  specNameText = specNameText.replace(")", "");
  h2.innerHTML = "Téma: " + specNameText;
  newBody.appendChild(h2);

  // create new h3 with date
  const h3 = document.createElement("h3");
  h3.classList.add("print-table-subtitle");
  const date = new Date();

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  } as const;
  const dateText = date.toLocaleDateString("cs-CZ", options);

  let firstTimeText = "";
  let secondTimeText = "";
  try {
    const firstTimeElement = document.querySelector(
      ".pars .tab.active a"
    ) as HTMLElement;
    firstTimeText = firstTimeElement.textContent as string;
    // text looks like this: '\n                        15:30 - 16:30\n                    '
    firstTimeText = firstTimeText.replace(/\s/g, "");
    firstTimeText = firstTimeText.replace("\n", "");
    firstTimeText = firstTimeText.split("-")[0];

    // get next element after ".pars .tab.active" that has class .tab
    const firstTimeElementParent =
      firstTimeElement.parentElement as HTMLElement;
    const nextElement =
      firstTimeElementParent.nextElementSibling as HTMLElement;
    let secondTimeElement = nextElement.querySelector("a") as HTMLElement;
    secondTimeText = secondTimeElement.textContent as string;
    secondTimeText = secondTimeText.replace(/\s/g, "");
    secondTimeText = secondTimeText.replace("\n", "");
    secondTimeText = secondTimeText.split("-")[1];
  } catch (error) {}

  if (firstTimeText == "" || secondTimeText == "") {
    h3.textContent = "Datum: " + dateText;
  } else {
    h3.textContent =
      "Datum: " + dateText + ", " + firstTimeText + "–" + secondTimeText;
  }

  newBody.appendChild(h3);

  newBody.appendChild(tableCopy);
  document.documentElement.appendChild(newBody);

  // original body with class .main hide via hidden attribute
  const main = document.querySelector("body.main") as HTMLElement;
  main.hidden = true;

  // create temporary style for printing
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      .print-table {
        width: max-content !important;
        font-size: 12px;
        border-collapse: collapse;
      }
      .print-table th, .print-table td {
        // border: 1px solid #000;
        padding: 8px;
        min-width: auto !important;
        width: auto !important;
        height: auto !important;
        text-align: left !important;
        color: #000 !important;
      }
    }

    .open-menu-block, md-sidenav, toolbar, .topPanel {
      display: none;
    }
    .table-wrapper .table {
      display: none;
    }

    #print-table {
      margin-top: 1rem;
      display: table !important;
    }

    #print-table .presents_stud td:not(.name) {
        display: none;
    }

    #print-table .presents_stud .number {
      display: table-cell !important;
      color: #000;
      font-weight: 300;
    }

    #print-table .presents_stud .presents-online {
      display: table-cell !important;
    }

    #print-table .presents_stud [ng-model="stud.was"] {
        display: none;
    }
    
    #print-table thead {
        display: none;
    }

    .print-table-title {
      font-weight: 500;
      font-size: 20px;
      margin-bottom: 1rem;
    }

    .print-table-subtitle {
      font-weight: 300;
      font-size: 16px;
      margin-bottom: 0.5rem;
    }
    
  `;
  document.head.appendChild(style);

  // print
  window.print();

  function returnToOriginal() {
    // remove temporary style
    style.remove();

    // remove temporary body
    newBody.remove();

    // show original body
    main.hidden = false;
  }

  addEventListener("afterprint", (event) => {
    returnToOriginal();
  });

  setTimeout(() => {
    returnToOriginal();
  }, 1000);
}

function printTable() {
  // if table doesnt have any content, return
  const testTable = document.querySelector(".wrapper-students table tbody");
  let testTableContent = testTable?.textContent || "";
  testTableContent = testTableContent?.replace(/\s/g, "");
  if (!testTableContent) return;

  // if print-students-button exists, return
  const printButtonExists = document.querySelector(
    "#print-students-button"
  ) as HTMLElement;
  if (printButtonExists) {
    return;
  }

  // prepend button to .topPanel .dialog-demo-content
  const topPanel = document.querySelector(
    ".topPanel .dialog-demo-content"
  ) as HTMLElement;
  const printButton = document.createElement("a");
  printButton.href = "#";
  printButton.id = "print-students-button";
  printButton.title = "Tisk studentů";
  printButton.innerHTML = "🖨️";
  printButton.classList.add("print-students-button");

  printButton.addEventListener("click", () => {
    copyTableForPrinting();
  });

  topPanel.appendChild(printButton);
}

// add right click to menu
export function presenceEnhancements(state) {
  if (state !== "presents") return;

  const hash = window.location.hash;
  if (hash !== "#/presents") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      addContextMenuForEachSelect();
      countPresentStudents();
      whenPresenceChanged();
      whenTeacherRoleChanged();
      whenClickedOnPresenceTh();

      automaticallySelectOnlineForOnlineGroups();
      detectIfNotRatedOrDiamonds();

      printTable();

      // when clicked on .presents .pars li
      const tabs = document.querySelectorAll(".presents .pars li");
      tabs.forEach((tab) => {
        tab.addEventListener("click", detectIfNotRatedOrDiamonds);
      });

      // observe .table-wrapper for changes
      const tableWrapper = document.querySelector(".table-wrapper");
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length) {
            automaticallySelectOnlineForOnlineGroups();
            detectIfNotRatedOrDiamonds();
          }
        });
      });
    } catch (error) {}
  }, 100);

  // longer timeout
  setTimeout(function () {
    try {
      correctBugTabsActiveWhenBreak();
    } catch (error) {}
  }, 200);
}
