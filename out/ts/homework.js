import { vocative } from "./vocative";
function selectRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
function findAllUnfinishedHomeworksFromModal() {
    try {
        const homeworks = document.querySelectorAll("md-dialog .hw-md_content .hw-md_item");
        for (let i = 0; i < homeworks.length; i++) {
            const homework = homeworks[i];
            enhanceHomeworkAssessment(homework);
        }
    }
    catch (error) { }
}
// add event listener to all homework buttons
function enhanceSingleHomeworkFromModalAfterEvent() {
    try {
        const homeworkButtons = document.querySelectorAll(".hw_new");
        for (let i = 0; i < homeworkButtons.length; i++) {
            const homeworkButton = homeworkButtons[i];
            homeworkButton.addEventListener("click", function () {
                setTimeout(function () {
                    const newHomework = document.querySelector(".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content");
                    enhanceHomeworkAssessment(newHomework, true);
                }, 500);
            });
        }
    }
    catch (error) { }
}
function findStudentsFirstName(homework, single) {
    const singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";
    const fullNameEl = homework.querySelector(`${singleSel} .bold`);
    // find vocativ for a name
    const fullName = fullNameEl.innerText;
    let firstName = fullName.split(" ")[0];
    // apply vocativ only if the page is in czech language
    if (document.documentElement.getAttribute("lang") === "cs-CZ") {
        firstName = vocative(firstName);
    }
    return firstName;
}
function getSelectedMark(homework) {
    let selectedMark = 0;
    // preselect maximmum mark only if it's not already selected
    const radioButtons = homework.querySelectorAll("md-radio-group md-radio-button");
    radioButtons.forEach(function (radioButton) {
        // @ts-ignore - unofficial element
        if (radioButton.ariaChecked == "true") {
            // @ts-ignore - unofficial element
            selectedMark = parseInt(radioButton.ariaLabel);
        }
    });
    if (selectedMark == 0) {
        const maxMark = homework.querySelector('md-radio-group  md-radio-button[aria-label="12"]');
        maxMark.click();
        selectedMark = 12;
    }
    return selectedMark;
}
function automateMessagesForStudents(homework, firstName, selectedMark) {
    const textarea = homework.querySelector(".hw-md_single_teacher__comment");
    let partialInteresting = selectRandomFromArray([
        "Moc pěkná práce!",
        "Luxusní práce!",
        "Perfektní práce!",
        "Super práce!",
        "Super!",
        "Parádní práce!",
    ]);
    let partialEnjoying = selectRandomFromArray([
        "Líbí se mi to.",
        "Je to moc zajímavé.",
        "Je to super.",
        "Je to parádní.",
        "Hodně dobře zpracované.",
    ]);
    let partialGetting = selectRandomFromArray([
        "Dostáváš",
        "Dávám Ti",
        "Zasloužíš si",
        "Dostáváš ode mě",
    ]);
    const message = `Zdravím ${firstName},\n\r${partialInteresting} ${partialEnjoying} ${partialGetting} ${selectedMark} bodů.\n\rS pozdravem`;
    textarea.value = message;
    // simulate input event
    textarea.dispatchEvent(new Event("input"));
    // hide message count until textarea is changed
    const messageCount = homework.querySelector(".hw-md_single_teacher__file-count");
    messageCount.style.display = "none";
    textarea.addEventListener("input", function () {
        messageCount.style.display = "unset";
    });
}
function enhanceHomeworkAssessment(homework, single) {
    let firstName = findStudentsFirstName(homework, single);
    let selectedMark = getSelectedMark(homework);
    automateMessagesForStudents(homework, firstName, selectedMark);
}
// original menu has a bug -> it doesn't update homework count
// -> observe if number of homework changes
function observeHomeworkCountAndUpdateMenu() {
    try {
        const hwCount = document.querySelector("[ng-show='new_hw && new_hw.length'] .hw-count");
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "characterData") {
                    const hwCountMenu = document.querySelector(`[ng-class="{active: activeNav == 'homeWork'}"]  .orange-count[aria-hidden="false"]`);
                    hwCountMenu.innerText = hwCount.innerText;
                    if (hwCount.innerText === "0") {
                        hwCountMenu.classList.add("ng-hide");
                    }
                }
            });
        });
        const config = {
            characterData: true,
            attributes: false,
            childList: false,
            subtree: true,
        };
        observer.observe(hwCount, config);
    }
    catch (error) { }
}
export function homeworkAutomation(state) {
    if (state !== "homeWork")
        return;
    // needs small timeout because angular firstly
    // adds and after that removes previous rows
    // so it would count previous rows as present
    setTimeout(function () {
        try {
            // console.log("homeworkAutomation");
            findAllUnfinishedHomeworksFromModal();
            enhanceSingleHomeworkFromModalAfterEvent();
            observeHomeworkCountAndUpdateMenu();
        }
        catch (error) { }
    }, 100);
}
