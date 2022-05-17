// todo import click from somewhere !!
function customClick(x, y) {
  const ev = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    screenX: x,
    screenY: y,
  });

  const el = document.elementFromPoint(x, y);
  el.dispatchEvent(ev);
}

function addContextMenu(event): void {
  event.preventDefault();
  customClick(event.clientX, event.clientY);

  const popupID = event.target.getAttribute("aria-owns");
  const isEnabled = event.target.getAttribute("aria-disabled") === "false";

  // console.log(event, popupID, isEnabled);
  const popup = document.getElementById(popupID);

  if (popup && isEnabled) {
    // hide popup before clicking
    popup.style.visibility = "hidden";

    // make click for us
    const maxMark = popup.querySelector("md-option[value='12']") as HTMLElement;
    maxMark.click();

    // change z-index to don't block scroll
    popup.style.zIndex = "-1";

    // click outside
    setTimeout(() => {
      customClick(50, 0);
    }, 500);

    setTimeout(() => {
      // show popup after custom click
      popup.style.visibility = "visible";
      popup.style.zIndex = "auto";
    }, 1000);
  }
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

      if (selection.classList.contains("ng-hide")) {
        return;
      }

      if (selection.classList.contains("was-not")) {
        return;
      }

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

function setTimeoutBeforePresenceEnhancements() {
  // we need to wait until angular part is ready
  // todo: potential rework, but dunno how yet
  setTimeout(function () {
    addContextMenuForEachSelect();
    countPresentStudents();
  }, 5000);
}

// add right click to menu
export function presenceEnhancements() {
  // we need to wait until angular part is ready
  // todo: potential rework, but dunno how yet

  // could be done with local storage

  setTimeout(function () {
    // add it to currently visible
    try {
      addContextMenuForEachSelect();
      countPresentStudents();
    } catch (error) {}

    // ad it to future ones
    try {
      const changePairLinks = document.querySelectorAll(
        '[ng-click="click_lenta($index)"]'
      );

      changePairLinks.forEach((link) => {
        link.addEventListener("click", setTimeoutBeforePresenceEnhancements);
      });
    } catch (error) {}
  }, 5000);
}
