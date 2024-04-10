// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css
// TODO: rework assets to wasm?
//  and then load them from the extension

// imports ---------------------------------------------------------------------
import * as incl from "./ts/_incl";
import { autoLogin, onLogout } from "./ts/autoLogin";
import { createPageTitle } from "./ts/createPageTitle";
import { onContextMenu, addInfoForMenu } from "./ts/contextMenu";
import { replaceDates } from "./ts/replaceDates";
import { replaceStrings } from "./ts/replaceStrings";
import { checkPing } from "./ts/checkPing";
import { presenceEnhancements } from "./ts/presence";
import { homeworkEnhancements } from "./ts/presenceAddHomework";
import { homeworkAutomation } from "./ts/homework";
import { addRightClickStar } from "./ts/contextMenuStar";
import { scheduleEnhancements } from "./ts/schedule";

// debug
// import { debugAngular } from "./ts/debugAngular";
// debugAngular();

// grab links to assets and download them
let needsRedownloadAssets = false;
import { findScripts } from "./ts/automate/find-js-files";
if (needsRedownloadAssets) {
  alert("Downloading assets, please wait around 20 seconds.");
  findScripts();
}

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

        // update language based on users selection
        let selectedLanguage = scope.current_lang;
        if (selectedLanguage !== undefined && selectedLanguage !== "cs") {
          document.documentElement.setAttribute("lang", selectedLanguage);
        }

        // auto login
        autoLogin(state);
        onLogout(state);

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

          homeworkEnhancements(state);
          homeworkAutomation(state);

          scheduleEnhancements(state);
        }

        // mutation observer with debounce, it checks if loading ended
        incl.runLoadingObserver(runAfterObserve);
      }
    );
  } catch (error) {}
})();
