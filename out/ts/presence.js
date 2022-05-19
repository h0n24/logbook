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
function addContextMenu(event) {
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
        const maxMark = popup.querySelector("md-option[value='12']");
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
            select.title =
                "Levé tlačítko: Otevřít — Pravé tlačítko: Dát maximální známku";
        });
    }
    catch (error) { }
}
function countPresentStudents() {
    const students = document.querySelectorAll(".wrapper-students tbody tr .presents");
    let total = Object.keys(students).length;
    let totalStudents = total ? total : 0;
    let totalPresent = 0;
    students.forEach((student) => {
        const dots = student.querySelectorAll("span");
        let wasPresent = 0;
        dots.forEach((dot) => {
            const selection = dot.querySelector("i:last-child");
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
    const thTotal = document.querySelector(".wrapper-students thead .number");
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
    const addMaterial = document.querySelector(".add-material");
    if (isTeacher) {
        // addMaterial.style.display = "inline-block";
        addMaterial.style.transitionDuration = "0.3s";
        addMaterial.style.opacity = "1";
        addMaterial.style.zIndex = "auto";
    }
    else {
        // addMaterial.style.display = "none";
        addMaterial.style.transitionDuration = "0s";
        addMaterial.style.zIndex = "-1";
        addMaterial.style.opacity = "0";
    }
}
function whenTeacherRoleChanged() {
    const teacherRole = document.querySelectorAll(".teacherInit .check-techers input");
    let selected = false;
    teacherRole.forEach((input) => {
        if (input.checked) {
            selected = true;
        }
    });
    hideMaterialsWhenNoTeacher(selected);
}
// add right click to menu
export function presenceEnhancements(state) {
    if (state !== "presents")
        return;
    // needs small timeout because angular firstly
    // adds and after that removes previous rows
    // so it would count previous rows as present
    setTimeout(function () {
        try {
            addContextMenuForEachSelect();
            countPresentStudents();
            whenPresenceChanged();
            whenTeacherRoleChanged();
        }
        catch (error) { }
    }, 100);
}
