// remove all previous rules
for (let index = 0; index < 100; index++) {
  // @ts-ignore: Not in this file, it's the chrome
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [index],
  });
}

let blockUrls = [];

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
  [
    "logbook.itstep.org/assets/*/angular.min.js",
    "script",
    "/js/angular.min.js",
  ],
  ["logbook.itstep.org/js/library/d3.js", "script", "/js/d3.min.js"],
  [
    "logbook.itstep.org/assets/*/angular-ui-router.min.js",
    "script",
    "/js/angular-ui-router.min.js",
  ],
  ["logbook.itstep.org/assets/*/raven.js", "script"],
  ["logbook.itstep.org/assets/*/raven-js/dist/plugins/angular.js", "script"],
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
  [
    "logbook.itstep.org/assets/3003f8bd/controllers/homeWorkCtrl.js",
    "script",
    "/js/homeWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/647cb260/controllers/classWorkCtrl.js",
    "script",
    "/js/classWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/647cb260/classwork-factory.js",
    "script",
    "/js/classwork-factory.js",
  ],
  [
    "logbook.itstep.org/assets/d1dda922/controllers/examsCtrl.js",
    "script",
    "/js/examsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/d1dda922/exams-factory.js",
    "script",
    "/js/exams-factory.js",
  ],
  [
    "logbook.itstep.org/assets/d1dda922/controllers/courseWorksCtrl.js",
    "script",
    "/js/courseWorksCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3003f8bd/homeworks-factory.js",
    "script",
    "/js/homeworks-factory.js",
  ],
  [
    "logbook.itstep.org/assets/3003f8bd/homeworks-filters.js",
    "script",
    "/js/homeworks-filters.js",
  ],
  [
    "logbook.itstep.org/assets/a097fc8/controllers/individualCtrl.js",
    "script",
    "/js/individualCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/a097fc8/individual-factory.js",
    "script",
    "/js/individual-factory.js",
  ],
  [
    "logbook.itstep.org/assets/6cbed22/controllers/newsCtrl.js",
    "script",
    "/js/newsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/6cbed22/news-factory.js",
    "script",
    "/js/news-factory.js",
  ],
  [
    "logbook.itstep.org/assets/61015245/controllers/profileCtrl.js",
    "script",
    "/js/profileCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/61015245/profile-factory.js",
    "script",
    "/js/profile-factory.js",
  ],
  [
    "logbook.itstep.org/assets/55145b54/controllers/reportCtrl.js",
    "script",
    "/js/reportCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/55145b54/report-factory.js",
    "script",
    "/js/report-factory.js",
  ],
  [
    "logbook.itstep.org/assets/48edb790/controllers/scheduleCtrl.js",
    "script",
    "/js/scheduleCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/48edb790/schedule_factory.js",
    "script",
    "/js/schedule_factory.js",
  ],
  [
    "logbook.itstep.org/assets/fc0060e6/controllers/mainStudCtrl.js",
    "script",
    "/js/mainStudCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/fc0060e6/controllers/sendStudentsMailCtrl.js",
    "script",
    "/js/sendStudentsMailCtrl.js",
  ],
];

let rulesArray = [];

blockUrls.forEach((url, index) => {
  let id = index + 1;

  const [domain, resourceType, redirectUrl] = url;
  let rule;

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
