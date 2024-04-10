import * as incl from "./_incl";

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

// add right click to menu
export function presenceEnhancements(state) {
  if (state !== "presents") return;

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
