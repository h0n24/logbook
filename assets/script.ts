// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css
// TODO: rework assets to wasm?
//  and then load them from the extension

// imports ---------------------------------------------------------------------
import { autoLogin } from "./ts/autoLogin";
import { createPageTitle } from "./ts/createPageTitle";
import { onContextMenu, addInfoForMenu } from "./ts/contextMenu";
import { replaceDates } from "./ts/replaceDates";
import { replaceStrings } from "./ts/replaceStrings";
import { checkPing } from "./ts/checkPing";
import { presenceEnhancements } from "./ts/presence";
import { addRightClickStar } from "./ts/contextMenuStar";

// debug
// import { debugAngular } from "./ts/debugAngular";
// debugAngular();

// init ------------------------------------------------------------------------

// change language on site (it keeps the same, ru-RU all the time)
document.documentElement.setAttribute("lang", "cs-CZ");

// check ping regularly
checkPing();

// right click on menu -> leads to doubleclick to prevent waiting
document.body.addEventListener("contextmenu", onContextMenu);

// after angular ---------------------------------------------------------------
(function () {
  // @ts-ignore: Not in this file, it's on the website
  // console.log(angular);
  try {
    // save angular scope
    // let scope =  angular.element(document).scope()

    // replace dates to better format
    // @ts-ignore: Not in this file, it's on the website
    angular.element(document).scope().dateFormat = "d. M. yyyy";
    // @ts-ignore: Not in this file, it's on the website
    angular.element(document).scope().dateFormatShort = "d. M.";

    // @ts-ignore: Not in this file, it's on the website
    angular
      .element(document)
      .scope()
      .$on(
        "$stateChangeSuccess",
        function (event, toState, toParams, fromState, fromParams) {
          console.log(
            "hlavní",
            event,
            toState,
            toParams,
            fromState,
            fromParams
          );

          const state = toState.name;

          // auto login
          autoLogin(state);

          // UX QOL improvements
          addInfoForMenu();
          addRightClickStar();

          // localization
          createPageTitle(state);

          function runAfterObserve() {
            // console.log("Debounced");

            // general stuff
            replaceDates();
            replaceStrings();

            // specific stuff
            presenceEnhancements(state);
          }

          // mutation observer with debounce, it checks if loading ended
          function debounce(func, timeout = 300) {
            let timer;
            return (...args) => {
              clearTimeout(timer);
              timer = setTimeout(() => {
                func.apply(this, args);
              }, timeout);
            };
          }

          const debounceObserver = debounce(() => runAfterObserve());

          const targetNode = document.querySelector("loading .loader");
          const config = { attributes: true };
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
      );
  } catch (error) {}
})();
