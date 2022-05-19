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
    customClick(event.clientX - 50, event.clientY);
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
  customClick(event.clientX, event.clientY);

  const popupID = event.target.getAttribute("aria-owns");
  const isEnabled = event.target.getAttribute("aria-disabled") === "false";

  // console.log(event, popupID, isEnabled);
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
    "Pravé tlačítko: Dát maximální známku všem studeentům. Pozor: trvá +1 sekundu za každého žáka.";

  workInClass.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const classWorkSelects = document.querySelectorAll(
      '.presentr-classWork md-select[aria-disabled="false"]'
    );

    console.log("todo this");
    console.log(classWorkSelects);

    let iteration = 0;

    classWorkSelects.forEach((select) => {
      // (select as HTMLElement).click();

      const popupID = select.getAttribute("aria-owns");
      const popup = document.getElementById(popupID);

      setTimeout(() => {
        // todo - unfinished
        // set12Mark(event, popup); // uncomment this and test it !!
        console.log(event, popup);
      }, iteration * 1000 + 1);

      iteration++;
    });
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
}
