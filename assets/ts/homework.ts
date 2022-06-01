import { vocative } from "./vocative";

export function homeworkAutomation(state) {
  if (state !== "homeWork") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      console.log("homeworkAutomation");

      const homeworks = document.querySelectorAll(
        "md-dialog .hw-md_content .hw-md_item"
      );

      console.log(homeworks);

      for (let i = 0; i < homeworks.length; i++) {
        const homework = homeworks[i];
        const fullNameEl = homework.querySelector(
          ".hw-md_stud__info .bold"
        ) as HTMLSpanElement;

        // find vocativ for a name
        const fullName = fullNameEl.innerText;
        let firstName = fullName.split(" ")[0];

        // apply vocativ only if the page is in czech language
        if (document.documentElement.getAttribute("lang") === "cs-CZ") {
          firstName = vocative(firstName);
        }

        // preselect maximmum mark only if it's not already selected
        const radioButtons = homework.querySelectorAll(
          "md-radio-group md-radio-button"
        ) as NodeListOf<HTMLInputElement>;

        let selectedMark = 0;
        radioButtons.forEach(function (radioButton) {
          // @ts-ignore - unofficial element
          if (radioButton.ariaChecked == "true") {
            // @ts-ignore - unofficial element
            selectedMark = parseInt(radioButton.ariaLabel);
          }
        });

        if (selectedMark == 0) {
          const maxMark = homework.querySelector(
            'md-radio-group  md-radio-button[aria-label="12"]'
          ) as HTMLInputElement;
          maxMark.click();
          selectedMark = 12;
        }

        const textarea = homework.querySelector(
          ".hw-md_single_teacher__comment"
        ) as HTMLTextAreaElement;

        const message = `Zdravím ${firstName},\n\rMoc pěkná práce! Líbí se mi to. Dostáváš ${selectedMark} bodů.\n\rS pozdravem`;
        textarea.value = message;

        // hide message count until textarea is changed
        const messageCount = homework.querySelector(
          ".hw-md_single_teacher__file-count"
        ) as HTMLSpanElement;
        messageCount.style.display = "none";

        textarea.addEventListener("input", function () {
          messageCount.style.display = "unset";
        });
      }
    } catch (error) {}
  }, 100);
}
