// simple debounce
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function clickOnPosition(x, y) {
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

export function showLoader() {
  const loader = document.querySelector("loading .loader");
  loader.classList.remove("ng-hide");
}

export function hideLoader() {
  const loader = document.querySelector("loading .loader");
  loader.classList.add("ng-hide");
}

export function runLoadingObserver(func) {
  const targetNode = document.querySelector("loading .loader");
  const config = { attributes: true };
  const observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "data-ng-animate") {
          // func();
          debounce(() => func());
        }
      }
    }
  });

  observer.observe(targetNode, config);
}
