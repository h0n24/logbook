import * as incl from "./_incl";

function set12Mark(event, popup) {
  // hide popup before clicking
  popup.style.visibility = "hidden";

  document.body.style.cursor = "wait";

  // make click for us
  const maxMark = popup.querySelector("md-option[value='12']") as HTMLElement;
  maxMark.click();

  // change z-index to don't block scroll
  popup.style.zIndex = "-1";

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
    ".wrapper-students thead tr th:nth-child(6)"
  );

  workInClass.title =
    "Pravé tlačítko: Dát maximální známku všem studentům. Pozor: trvá +1 sekundu za každého žáka.";

  workInClass.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    incl.showLoader();

    const classWorkSelects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    let iteration = 0;

    classWorkSelects.forEach((select) => {
      const popupID = select.getAttribute("aria-owns");
      const popup = document.getElementById(popupID);

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
      }, iteration * 1000 + 1);

      iteration++;
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
  const addMaterial: HTMLDivElement = document.querySelector(".add-material");

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
    } catch (error) {}
  }, 100);

  // longer timeout
  setTimeout(function () {
    try {
      correctBugTabsActiveWhenBreak();
      console.log("Presence enhancements loaded");
    } catch (error) {}
  }, 200);
}
