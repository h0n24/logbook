/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPageTitle": function() { return /* binding */ createPageTitle; }
/* harmony export */ });
// change the title of the page - so it doesn't show the url
function createPageTitle(source) {
    // console.log("creating page title", source);
    var url = "";
    source === "presents" ? (url = "Prezence") : (url = url);
    source === "schedulePage" ? (url = "Kalendář") : (url = url);
    source === "news" ? (url = "Novinky") : (url = url);
    source === "students.list" ? (url = "Studenti") : (url = url);
    source === "students.comment" ? (url = "Zpráva pro studenta") : (url = url);
    source === "students.send_mail" ? (url = "Zpráva pro skupinu") : (url = url);
    source === "groupsPage" ? (url = "Skupinová účast") : (url = url);
    source === "bind.materials" ? (url = "Učební pomůcky") : (url = url);
    source === "bind.teach_materials_teach"
        ? (url = "Moje materiály")
        : (url = url);
    source === "traffic" ? (url = "Potenciální ztráty") : (url = url);
    source === "homeWork" ? (url = "Domácí úkoly") : (url = url);
    source === "classWork" ? (url = "Práce v hodině") : (url = url);
    source === "exams" ? (url = "Moje zkoušky") : (url = url);
    source === "report" ? (url = "Reporty") : (url = url);
    source === "tasks" ? (url = "Úkoly") : (url = url);
    source === "content_author" ? (url = "Přidat obsah") : (url = url);
    var title = document.querySelector("title");
    if (url) {
        title.innerText = url + " — LogBook";
    }
    else {
        title.innerText = "LogBook";
    }
}


/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "onContextMenu": function() { return /* binding */ onContextMenu; },
/* harmony export */   "addInfoForMenu": function() { return /* binding */ addInfoForMenu; }
/* harmony export */ });
// right click on menu -> leads to doubleclick to prevent waiting --------------
function click(x, y) {
    var ev = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        screenX: x,
        screenY: y
    });
    var el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}
// TODO: maybe detect what is under the cursor and then clik on it directly?
// because waiting for the menu to open is extremely slow
function onContextMenu(event) {
    // @ts-ignore: Not in this file, it's on the website
    if (event.pageX <= 16 * 3) {
        // alert("yes");
        event.preventDefault();
        // @ts-ignore: Not in this file, it's on the website
        click(event.clientX, event.clientY);
        setTimeout(function () {
            // @ts-ignore: Not in this file, it's on the website
            click(event.clientX, event.clientY);
        }, 250);
    }
}
// title info for .open-menu-block
function addInfoForMenu() {
    try {
        document.querySelector(".open-menu-block").title =
            "Levé tlačítko: Otevřít menu — Pravé tlačítko: Otevřít položku menu";
    }
    catch (error) { }
}


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "replaceDates": function() { return /* binding */ replaceDates; }
/* harmony export */ });
// Time since
function timeSince(date) {
    var now = +new Date();
    var seconds = Math.floor((now - date) / 1000);
    var interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " let";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " měsíců";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " dní";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hodin";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minut";
    }
    return Math.floor(seconds) + " sekund";
}
// Rewrite dates to ago
// Example: Naposledy navštívil MyStat : 13.12.21
// Return: 1 dní+
function replaceDates() {
    // todo: rework so its more persistent?
    // right now its not catching switch between pairs aka different lectures
    setTimeout(function () {
        try {
            var testElement = document.querySelector('[ng-if="stud.last_date_vizit != null"] span');
            var testElementText = testElement.innerText;
            var _a = testElementText.split("."), day = _a[0], month = _a[1], year = _a[2];
            var date = "20" + year + "-" + month + "-" + day;
            var testElementDate = Date.parse(date);
            var testElementFinal = timeSince(testElementDate);
            var testElementLocalizedDate = new Date(testElementDate).toLocaleDateString("cs-CZ");
            testElement.innerText = testElementFinal;
            testElement.title = testElementLocalizedDate + "+";
            console.log("trying to replace dates");
            console.log(testElementText, date, testElementDate, testElementFinal, testElementLocalizedDate);
        }
        catch (error) { }
    }, 1000);
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ts_createPageTitle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _ts_contextMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _ts_replaceDates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css
// TODO: rework assets to wasm?
//  and then load them from the extension
// imports ---------------------------------------------------------------------



// debug
// import { debugAngular } from "./ts/debugAngular";
// debugAngular();
// init ------------------------------------------------------------------------
// change language on site (it keeps the same, ru-RU all the time)
document.documentElement.setAttribute("lang", "cs-CZ");
// right click on menu -> leads to doubleclick to prevent waiting
document.body.addEventListener("contextmenu", _ts_contextMenu__WEBPACK_IMPORTED_MODULE_1__.onContextMenu);
// after angular ---------------------------------------------------------------
(function () {
    // @ts-ignore: Not in this file, it's on the website
    angular
        .element(document)
        .scope()
        .$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
        console.warn("hlavní", event, toState, toParams, fromState, fromParams);
        // UX QOL improvements
        (0,_ts_contextMenu__WEBPACK_IMPORTED_MODULE_1__.addInfoForMenu)();
        // localization
        (0,_ts_createPageTitle__WEBPACK_IMPORTED_MODULE_0__.createPageTitle)(toState.name);
        (0,_ts_replaceDates__WEBPACK_IMPORTED_MODULE_2__.replaceDates)();
    });
})();

}();
/******/ })()
;