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
  const popup = document.getElementById(popupID);

  if (popup) {
    // hide popup before clicking
    popup.style.visibility = "hidden";

    setTimeout(() => {
      // show popup after custom click
      popup.style.visibility = "visible";
    }, 1000);

    // make click for us
    const maxMark = popup.querySelector("md-option[value='12']") as HTMLElement;
    maxMark.click();

    // click outside
    setTimeout(() => {
      customClick(50, 0);
    }, 500);
  }
}

function addContextMenuForEachSelect() {
  try {
    const selects = document.querySelectorAll(
      ".presentr-classWork md-select[aria-disabled='false']"
    );

    selects.forEach((select) => {
      select.addEventListener("contextmenu", addContextMenu);
    });
  } catch (error) {}
}

function setTimeoutBeforeAddingContextMenu() {
  // we need to wait until angular part is ready
  // todo: potential rework, but dunno how yet
  setTimeout(function () {
    addContextMenuForEachSelect();
  }, 5000);
}

// add right click to menu
export function addRightClickPresence() {
  // we need to wait until angular part is ready
  // todo: potential rework, but dunno how yet
  setTimeout(function () {
    // add it to currently visible
    try {
      addContextMenuForEachSelect();
    } catch (error) {}

    // ad it to future ones
    try {
      const changePairLinks = document.querySelectorAll(
        '[ng-click="click_lenta($index)"]'
      );

      changePairLinks.forEach((link) => {
        link.addEventListener("click", setTimeoutBeforeAddingContextMenu);
      });
    } catch (error) {}
  }, 5000);
}
