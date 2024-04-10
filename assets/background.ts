// change this after running find-js-files.js
import { automatedBlockUrls } from "./background-auto";

// remove all previous rules
for (let index = 0; index < 200; index++) {
  // @ts-ignore: Not in this file, it's the chrome
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [index],
  });
}

let blockUrls: any = [];
blockUrls = [
  [
    "logbook.itstep.org/assets/*/bootstrap/dist/css/bootstrap.css",
    "stylesheet",
  ],
  [
    "logbook.itstep.org/assets/*/angular-material/angular-material.min.css",
    "stylesheet",
  ],
  ["fonts.googleapis.com/css", "stylesheet"],
  ["logbook.itstep.org/css/main.css", "stylesheet"],
  ["logbook.itstep.org/css/site.css", "stylesheet"],
  ["logbook.itstep.org/css/media.css", "stylesheet"],
  ["logbook.itstep.org/assets/*/tablesort.css", "stylesheet"],
  ["logbook.itstep.org/assets/*/chosen.css", "stylesheet"],
  ["logbook.itstep.org/assets/*/bootstrap/dist/js/bootstrap.js", "script"],
  ["logbook.itstep.org/assets/*/jquery/dist/jquery.js", "script"],
  ["logbook.itstep.org/assets/*/jquery.js", "script", "/js/jquery.min.js"],
  [
    "https://cdnjs.cloudflare.com/ajax/libs/angular-material/1.0.9/angular-material.min.js",
    "script",
  ],
  ["google-analytics.com", "script"],
  ["logbook.itstep.org/assets/*/raven.js", "script"],
  ["logbook.itstep.org/assets/*/raven-js/dist/plugins/angular.js", "script"],
  [
    "logbook.itstep.org/assets/*/angular-material/angular-material.min.js",
    "script",
    "/js/angular-material.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular.min.js",
    "script",
    "/js/angular.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-ui-router.min.js",
    "script",
    "/js/angular-ui-router.min.js",
  ],
  [
    "https://logbook.itstep.org/js/angular/script.js",
    "script",
    "/js/script.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-animate.min.js",
    "script",
    "/js/angular-animate.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-aria.min.js",
    "script",
    "/js/angular-aria.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-messages.min.js",
    "script",
    "/js/angular-messages.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-local-storage.min.js",
    "script",
    "/js/angular-local-storage.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-translate.min.js",
    "script",
    "/js/angular-translate.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/toArrayFilter.js",
    "script",
    "/js/toArrayFilter.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-translate-loader-url.min.js",
    "script",
    "/js/angular-translate-loader-url.min.js",
  ],
  [
    "logbook.itstep.org/assets/*/angular-tablesort.js",
    "script",
    "/js/angular-tablesort.min.js",
  ],
  ["logbook.itstep.org/assets/*/chosen.js", "script", "/js/chosen.js"],
  [
    "logbook.itstep.org/assets/*/angular-chosen.min.js",
    "script",
    "/js/angular-chosen.min.js",
  ],
  [
    "logbook.itstep.org/js/angular/create-graph.js",
    "script",
    "/js/create-graph.js",
  ],
  [
    "logbook.itstep.org/js/angular/directives.js",
    "script",
    "/js/directives.js",
  ],
  [
    "logbook.itstep.org/js/angular/base-factory.js",
    "script",
    "/js/base-factory.js",
  ],
  [
    "logbook.itstep.org/js/angular/base-controller.js",
    "script",
    "/js/base-controller.js",
  ],
  [
    "logbook.itstep.org/js/angular/signal/controllers/signalCtrl.js",
    "script",
    "/js/signalCtrl.js",
  ],
  [
    "logbook.itstep.org/js/angular/signal/signal-factory.js",
    "script",
    "/js/signal-factory.js",
  ],
  [
    "logbook.itstep.org/js/angular/signal/signal-filters.js",
    "script",
    "/js/signal-filters.js",
  ],
];

let blockJson = [
  [
    "logbook.itstep.org/auth/get-marks-selects",
    "xmlhttprequest",
    "/resources/get-marks-selects.json",
  ],
  [
    "logbook.itstep.org/bind/city-list",
    "xmlhttprequest",
    "/resources/city-list.json",
  ],
];

// append to blockUrls
blockUrls = blockUrls.concat(blockJson);

let blockImageUrls = [
  [
    "logbook.itstep.org/img/home/star_icon.svg",
    "image",
    "/resources/star_icon.svg",
  ],
  [
    "logbook.itstep.org/img/home/icon-info.svg",
    "image",
    "/resources/icon-info.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/materials.svg",
    "image",
    "/resources/materials.svg",
  ],
  ["logbook.itstep.org/img/side-bar/news.svg", "image", "/resources/news.svg"],
  [
    "logbook.itstep.org/img/side-bar/tasks.svg",
    "image",
    "/resources/tasks.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/schedule.svg",
    "image",
    "/resources/schedule.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/potential-losses.svg",
    "image",
    "/resources/potential-losses.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/content-author.svg",
    "image",
    "/resources/content-author.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/homeworks.svg",
    "image",
    "/resources/homeworks.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/report.svg",
    "image",
    "/resources/report.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/my-exams.svg",
    "image",
    "/resources/my-exams.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/groups-vizit.svg",
    "image",
    "/resources/groups-vizit.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/class-work.svg",
    "image",
    "/resources/class-work.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/present.svg",
    "image",
    "/resources/present.svg",
  ],
  [
    "logbook.itstep.org/img/side-bar/students.svg",
    "image",
    "/resources/students.svg",
  ],
  ["logbook.itstep.org/img/avatarka.svg", "image", "/resources/avatarka.svg"],
];

// was before ping rework:   ["logbook.itstep.org/favicon.ico", "image", "/resources/favicon.ico"],

// append array blockImageUrls to blockUrls array
blockUrls = blockUrls.concat(blockImageUrls);

// append automatedBlockUrls to blockUrls
blockUrls = blockUrls.concat(automatedBlockUrls);

// console.log(blockUrls);

let rulesArray: any = [];
blockUrls.forEach((url, index) => {
  let id = index + 1;
  const [domain, resourceType, redirectUrl] = url;
  let rule: any;
  // console.log(`Blocking ${domain} with ${resourceType}`);
  if (redirectUrl !== undefined) {
    // redirecting url
    rule = {
      id: id,
      priority: 1,
      action: { type: "redirect", redirect: { extensionPath: redirectUrl } },
      condition: {
        urlFilter: domain,
        domains: ["logbook.itstep.org"],
        resourceTypes: [resourceType],
      },
    };
  } else {
    // blocking url
    rule = {
      id: id,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: domain,
        domains: ["logbook.itstep.org"],
        resourceTypes: [resourceType],
      },
    };
  }
  rulesArray.push(rule);
});
// @ts-ignore: Not in this file, it's the chrome
chrome.declarativeNetRequest.updateDynamicRules({
  addRules: rulesArray,
});
// @ts-ignore: Not in this file, it's the chrome
// chrome.declarativeNetRequest.getEnabledRulesets((rulesetIds) =>
//   console.log("rules added", rulesetIds)
// );
