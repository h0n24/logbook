// TODO: possible future rework to use scopes of angular, more here: https://jsfiddle.net/e7gw3Lm8/

// simple debounce
export function debounce(func: Function, timeout: number = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

// clicks on target mouse position
// i.e. used when clicking outside custom selects when automating stuff
export function clickOnPosition(x: number, y: number) {
  const ev = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    screenX: x,
    screenY: y,
  });

  const el = document.elementFromPoint(x, y) as HTMLElement;
  el.dispatchEvent(ev);
}

// show and hide loader programatically
export function showLoader() {
  const loader = document.querySelector("loading .loader") as HTMLElement;
  loader.classList.remove("ng-hide");
}

export function hideLoader() {
  const loader = document.querySelector("loading .loader") as HTMLElement;
  loader.classList.add("ng-hide");
}

// loading observer with debounce,
// solving issue with catching angular loading times
export function runLoadingObserver(func: Function) {
  const targetNode = document.querySelector("loading .loader") as HTMLElement;
  const config = { attributes: true };

  const debounceObserver = debounce(() => func());

  const observer = new MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "data-ng-animate") {
          debounceObserver();
        }
      }
    }
  });

  observer.observe(targetNode, config);
}
