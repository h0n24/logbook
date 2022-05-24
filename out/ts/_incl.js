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
// clicks on target mouse position
// i.e. used when clicking outside custom selects when automating stuff
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
// show and hide loader programatically
export function showLoader() {
    const loader = document.querySelector("loading .loader");
    loader.classList.remove("ng-hide");
}
export function hideLoader() {
    const loader = document.querySelector("loading .loader");
    loader.classList.add("ng-hide");
}
// loading observer with debounce,
// solving issue with catching angular loading times
export function runLoadingObserver(func) {
    const targetNode = document.querySelector("loading .loader");
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
