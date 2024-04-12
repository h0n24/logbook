import { vocative } from "./vocative";

function selectRandomFromArray(array: string[]): string {
  return array[Math.floor(Math.random() * array.length)];
}

function findAllUnfinishedHomeworksFromModal(homeworksWrap) {
  try {
    const homeworks = homeworksWrap.querySelectorAll(
      "md-dialog .hw-md_content .hw-md_item"
    );

    for (let i = 0; i < homeworks.length; i++) {
      const homework = homeworks[i];
      enhanceHomeworkAssessment(homework);
    }
  } catch (error) {}
}

// add event listener to all homework buttons
function enhanceSingleHomeworkFromModalAfterEvent() {
  try {
    const homeworkButtons = document.querySelectorAll(".hw_new");
    for (let i = 0; i < homeworkButtons.length; i++) {
      const homeworkButton = homeworkButtons[i];
      homeworkButton.addEventListener("click", function () {
        setTimeout(function () {
          const newHomework = document.querySelector(
            ".md-dialog-container[tabindex='-1'] md-dialog .hw-md_single__content"
          ) as Element;

          if (!newHomework) return;
          enhanceHomeworkAssessment(newHomework, true);
        }, 1);
      });
    }
  } catch (error) {}
}

function findStudentsFirstName(homework: Element, single?: boolean) {
  const singleSel = single ? ".hw-md_single_stud__info" : ".hw-md_stud__info";

  const fullNameEl = homework.querySelector(
    `${singleSel} .bold`
  ) as HTMLSpanElement;

  if (!fullNameEl) return "";

  // find vocativ for a name
  const fullName = fullNameEl.innerText;
  let firstName = fullName.split(" ")[0];

  // apply vocativ only if the page is in czech language
  if (document.documentElement.getAttribute("lang") === "cs-CZ") {
    firstName = vocative(firstName);
  }
  return firstName;
}

function getSelectedMark(homework: Element) {
  let selectedMark = 0;

  // preselect maximmum mark only if it's not already selected
  const radioButtons = homework.querySelectorAll(
    "md-radio-group md-radio-button"
  ) as NodeListOf<HTMLInputElement>;

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

  return selectedMark;
}

function automateMessagesForStudents(
  homework: Element,
  firstName: string,
  selectedMark: number
) {
  const textarea = homework.querySelector(
    ".hw-md_single_teacher__comment"
  ) as HTMLTextAreaElement;

  if (!textarea) return;

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
  textarea.dispatchEvent(new Event("change"));

  // hide message count until textarea is changed
  const messageCount = homework.querySelector(
    ".hw-md_single_teacher__file-count"
  ) as HTMLSpanElement;
  messageCount.style.display = "none";

  textarea.addEventListener("input", function () {
    messageCount.style.display = "unset";
  });
}

function makeURLinTextClickable(homework) {
  try {
    // if you find class .hw-md_single_stud-work__answer-text make any text inside that is a link clickable
    const studentsComments = homework.querySelector(
      ".hw-md_single_stud-work__answer-text"
    );

    if (studentsComments === null) return;
    let originalText = studentsComments.innerText;

    if (!originalText) return;
    let newText = createUrlfromText(originalText);

    if (newText) {
      studentsComments.innerHTML = newText;
    }
  } catch (error) {
    console.log("makeURLinTextClickable error", error);
  }
}

function createUrlfromText(originalText: any) {
  // detect if text contains url
  let text = originalText as string;
  const url = text.match(/(https?:\/\/[^\s]+)/g);

  // make the url in the text clickable for every url
  if (url) {
    for (let i = 0; i < url.length; i++) {
      const selURL = url[i];
      text = text.replace(
        selURL,
        `<a href="${selURL}" target="_blank">${selURL}</a>`
      );
    }

    return text;
  }
}

function enhanceHomeworkAssessment(homework: Element, single?: boolean) {
  if (homework === null) return;
  // prevent doing this multiple times by adding a data-attribute alreadyEnhanced
  if (homework.getAttribute("alreadyEnhanced") === "true") {
    return;
  } else {
    let firstName = findStudentsFirstName(homework, single);
    let selectedMark = getSelectedMark(homework);

    automateMessagesForStudents(homework, firstName, selectedMark);

    makeURLinTextClickable(homework);

    homework.setAttribute("alreadyEnhanced", "true");
  }
}

// original menu has a bug -> it doesn't update homework count
// -> observe if number of homework changes
function observeHomeworkCountAndUpdateMenu() {
  try {
    const hwCount = document.querySelector(
      "[ng-show='new_hw && new_hw.length'] .hw-count"
    ) as HTMLSpanElement;

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "characterData") {
          const hwCountMenu = document.querySelector(
            `[ng-class="{active: activeNav == 'homeWork'}"]  .orange-count[aria-hidden="false"]`
          ) as HTMLSpanElement;

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
  } catch (error) {}
}

function observeIfNewHomeworksAdded(homeworksWrap) {
  // if  .hw-md_item in .md-dialog in .hw-md_content is added
  // then enhance it
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") {
        findAllUnfinishedHomeworksFromModal(homeworksWrap);
      }
    });
  });

  const config = {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: true,
  };
  observer.observe(homeworksWrap, config);
}

function convertnl2br(text: string) {
  return text.replace(/(?:\r\n|\r|\n)/g, "<br>");
}

function addOriginalEventListenerBack() {
  function eventListenerForOldModal(event) {
    if (event.key === "Escape") {
      const myDialog = document.querySelector("#myDialog") as Element;

      if (myDialog) myDialog.remove();

      // remove event listeners from body
      // @ts-ignore
      document.body.removeEventListeners("keydown");

      // remove class .md-dialog-is-showing from body
      document.body.classList.remove("md-dialog-is-showing");
    }
  }

  document.body.addEventListener("keyup", eventListenerForOldModal);
}

function eventListenerForNewModal(event) {
  if (event.key === "Escape") {
    const dialogElement = document.querySelector("#modal-file") as Element;
    dialogElement.classList.remove("active");
  }
}

function removeEventListenerFromOriginalDialogWrapper() {
  // TODO: works randomly, not always, needs future rework
  // @ts-ignore
  document.body.removeEventListeners("keydown");
  // @ts-ignore
  document.body.removeEventListeners("keyup");
  // @ts-ignore
  document.body.removeEventListeners("keypress");
}

function createEventListenerForFileModal() {
  // removeEventListenerFromOriginalDialogWrapper();

  document.addEventListener("keyup", eventListenerForNewModal);
}

function addDataToPre(type: any, data: any, pre: HTMLPreElement) {
  if (type === "text") {
    let dataText = createUrlfromText(data ?? "") ?? "";
    if (!dataText) {
      dataText = data;
    }
    if (!dataText) {
      dataText =
        "Obsah souboru se nepodařilo načíst. :( Zkuste to ještě jednou, nebo si jej stáhněte";
    }
    dataText = convertnl2br(dataText);
    // @ts-ignore
    pre.innerHTML = dataText;
  }
  if (type === "pdf") {
    const iframe = document.createElement("iframe");
    iframe.src = data;

    pre.innerHTML = "";
    pre.appendChild(iframe);
  }
}

function createModalLayout(data: any, url: any, type: any) {
  function eventCloseNewModal(event) {
    event.preventDefault();
    dialog.classList.remove("active");
    // TODO: uncomment
    // addOriginalEventListenerBack2(eventListenerForNewModal);
  }

  const dialog = document.createElement("div");
  dialog.id = "modal-file";
  dialog.classList.add("modal-file", "active");

  // create link a with href #close class .modal-overlay and aria-label Close
  const modalOverlay = document.createElement("a");
  modalOverlay.href = "#close";
  modalOverlay.classList.add("modal-overlay");
  modalOverlay.setAttribute("aria-label", "Close");

  // create div with class .modal-container
  const container = document.createElement("div");
  container.classList.add("modal-container");

  // create div with class .modal-header
  const header = document.createElement("div");
  header.classList.add("modal-header");

  // create a#close with class btn btn-clear float-right aria-label Close
  const close = document.createElement("a");
  close.href = "#close";
  close.classList.add("btn-modal-close");
  close.setAttribute("aria-label", "Close");

  // create modal title
  const title = document.createElement("h4");
  if (type === "text") {
    title.textContent = "Obsah souboru .txt";
  }
  if (type === "pdf") {
    title.textContent = "Obsah souboru .pdf";
  }

  // create div with class .modal-body
  const body = document.createElement("div");
  body.classList.add("modal-body");

  // create pre with data from file
  const pre = document.createElement("div") as unknown as HTMLPreElement;
  pre.classList.add("modal-pre");
  addDataToPre(type, data, pre);

  // create modal-footer
  const footer = document.createElement("div");
  footer.classList.add("modal-footer");

  // add button to download original file
  const download = document.createElement("a");
  download.classList.add("btn", "btn-primary");
  download.href = url;
  download.innerText = "Stáhnout původní soubor";

  // add second button to close
  const close2 = document.createElement("a");
  close2.href = "#close";
  close2.classList.add("btn-modal-close2");
  close2.innerText = "Zavřít okno";

  // add buttons to close the modal
  close.addEventListener("click", eventCloseNewModal);
  close2.addEventListener("click", eventCloseNewModal);
  modalOverlay.addEventListener("click", eventCloseNewModal);

  // close modal on escape key
  createEventListenerForFileModal();

  // append elements
  header.appendChild(title);
  header.appendChild(close);
  body.appendChild(pre);
  footer.appendChild(download);
  footer.appendChild(close2);
  container.appendChild(header);
  container.appendChild(body);
  container.appendChild(footer);
  dialog.appendChild(modalOverlay);
  dialog.appendChild(container);

  // append modal to body
  document.body.appendChild(dialog);
}

function createModalForFiles(data, url, type) {
  // detect if #modal-file exists and if it does, just update the content
  const existingModal = document.querySelector("#modal-file");
  if (existingModal) {
    const pre = existingModal.querySelector(".modal-pre") as HTMLPreElement;
    addDataToPre(type, data, pre);

    existingModal.classList.add("active");
    let download = existingModal.querySelector(
      ".modal-footer a"
    ) as HTMLAnchorElement;
    download.href = url;
    return;
  }

  // create modal via HTML dialog
  createModalLayout(data, url, type);
}

function manipulateWithWindowOpen() {
  // This will get argument url from window.open without changing the original function
  // @ts-ignore
  window.open = (function (original) {
    return function (url, windowName, windowFeatures) {
      // console.log("url", url, windowName, windowFeatures);
      const urlText = url as string;

      // TODO FUTURE: detect open modals and close them

      // if url contains "https://fsx1.itstep.org/api/v1/files"
      // then open the file in javascript
      if (urlText.includes("https://fsx1.itstep.org/api/v1/files")) {
        // fetch the file
        // Q: how to get the filename from the response? i know the browser can do it
        fetch(urlText, {
          method: "GET",
          headers: {
            "Content-Type": "text/plain;charset=UTF-8",
          },
        })
          .then((response) => {
            return response.blob();
          })
          .then((blob) => {
            // console.log(blob.type);

            // create a url for the file
            if (blob.type.includes("text")) {
              // read contents of the blob via FileReader
              const reader = new FileReader();

              reader.addEventListener("load", function () {
                const data = reader.result;
                createModalForFiles(data, urlText, "text");
              });

              reader.readAsText(blob);
            } else if (blob.type.includes("pdf")) {
              const url = URL.createObjectURL(blob);
              createModalForFiles(url, urlText, "pdf");
            } else {
              // returning original function for other type of files such as "application/zip"
              return original(url, windowName, windowFeatures);
            }
          });
      } else {
        // returning original function
        return original(url, windowName, windowFeatures);
      }
    };
  })(window.open);
}

export function homeworkAutomation(state) {
  if (state !== "homeWork") return;

  const hash = window.location.hash;
  if (hash !== "#/homeWork") return;

  // needs small timeout because angular firstly
  // adds and after that removes previous rows
  // so it would count previous rows as present
  setTimeout(function () {
    try {
      // console.log("homeworkAutomation");

      const homeworksWrap = document.querySelector(".hw-md_content") as Element;

      findAllUnfinishedHomeworksFromModal(homeworksWrap);

      enhanceSingleHomeworkFromModalAfterEvent();

      observeHomeworkCountAndUpdateMenu();

      observeIfNewHomeworksAdded(homeworksWrap);

      manipulateWithWindowOpen();
    } catch (error) {}
  }, 100);
}
