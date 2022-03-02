// TODO: block assets that are super slow, such as outdated jquery, raven and few material js and css
// TODO: rework assets to wasm?
//  and then load them from the extension

// imports ---------------------------------------------------------------------

import { onContextMenu, addInfoForMenu } from "./ts/contextMenu";

// debug
// import { debugAngular } from "./ts/debugAngular";
// debugAngular();

// right click on menu -> leads to doubleclick to prevent waiting --------------
document.body.addEventListener("contextmenu", onContextMenu);

// not being used yet - more effective replacement for strings
function replaceWithTreeWalker() {
  var allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    ),
    // some temp references for performance
    tmptxt,
    tmpnode,
    // compile the RE and cache the replace string, for performance
    cakeRE = "Naposledy navštívil MyStat",
    replaceValue = "V MyStatu?";

  // iterate through all text nodes
  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;
    tmptxt = tmpnode.nodeValue;
    tmpnode.nodeValue = tmptxt.replace(cakeRE, replaceValue);
  }
}

// Time since
function timeSince(date) {
  const now = +new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000;

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

  setTimeout(() => {
    try {
      const testElement = document.querySelector(
        '[ng-if="stud.last_date_vizit != null"] span'
      ) as HTMLElement;

      const testElementText = testElement.innerText;
      const [day, month, year] = testElementText.split(".");
      const date = `20${year}-${month}-${day}`;

      const testElementDate = Date.parse(date);
      const testElementFinal = timeSince(testElementDate);
      const testElementLocalizedDate = new Date(
        testElementDate
      ).toLocaleDateString("cs-CZ");

      testElement.innerText = testElementFinal;
      testElement.title = testElementLocalizedDate + "+";

      console.log("trying to replace dates");
      console.log(
        testElementText,
        date,
        testElementDate,
        testElementFinal,
        testElementLocalizedDate
      );
    } catch (error) {}
  }, 1000);
}

// change the title of the page - so it doesn't show the url
function createPageTitle(source: string) {
  // console.log("creating page title", source);

  let url = "";

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

  const title = document.querySelector("title") as HTMLElement;

  if (url) {
    title.innerText = url + " — LogBook";
  } else {
    title.innerText = "LogBook";
  }
}

// immediatelly on start change language on site (it keeps the same, ru-RU all the time)
document.documentElement.setAttribute("lang", "cs-CZ");

// debug tools - v2
(function () {
  // @ts-ignore: Not in this file, it's on the website
  angular
    .element(document)
    .scope()
    .$on(
      "$stateChangeSuccess",
      function (event, toState, toParams, fromState, fromParams) {
        console.warn("hlavní", event, toState, toParams, fromState, fromParams);

        // UX QOL improvements
        addInfoForMenu();

        // localization
        createPageTitle(toState.name);

        replaceDates();
      }
    );
})();
