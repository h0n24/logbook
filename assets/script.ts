// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css
// TODO: rework assets to wasm?
//  and then load them from the extension

// imports ---------------------------------------------------------------------
import * as incl from "./ts/_incl";
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
  try {
    // save angular scope
    // @ts-ignore: Not in this file, it's on the website
    let scope = angular.element(document).scope();

    // replace dates to better format
    scope.dateFormat = "d. M. yyyy";
    scope.dateFormatShort = "d. M.";

    scope.$on(
      "$stateChangeSuccess",
      function (event, toState, toParams, fromState, fromParams) {
        console.log("hlavní", event, toState, toParams, fromState, fromParams);

        const state = toState.name;

        // auto login
        autoLogin(state);

        // UX QOL improvements
        addInfoForMenu();
        addRightClickStar();

        // localization
        createPageTitle(state);

        function runAfterObserve() {
          // general stuff
          replaceDates();
          replaceStrings();

          // specific stuff
          presenceEnhancements(state);
        }

        // mutation observer with debounce, it checks if loading ended
        incl.runLoadingObserver(runAfterObserve());
      }
    );
  } catch (error) {}
})();
