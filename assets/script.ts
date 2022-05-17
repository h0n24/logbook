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
import { addRightClickPresence } from "./ts/contextMenuPresence";
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

          // auto login
          autoLogin(toState.name);

          // UX QOL improvements
          addInfoForMenu();
          addRightClickStar();

          // localization
          createPageTitle(toState.name);

          replaceDates();

          replaceStrings();

          addRightClickPresence();
        }
      );

    // @ts-ignore: Not in this file, it's on the website
    angular
      .element(document)
      .scope()
      .$broadcast("dataFetchComplete", function () {
        alert("dataFetchComplete");
      });
  } catch (error) {}
})();
