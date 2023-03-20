// remove all previous rules
for (let index = 0; index < 200; index++) {
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
  ["logbook.itstep.org/favicon.ico", "image", "/resources/favicon.ico"],
];

// append array blockImageUrls to blockUrls array
blockUrls = blockUrls.concat(blockImageUrls);

// change this after running find-js-files.js
let automatedBlockUrls = [["logbook.itstep.org/assets/c426aedf/bootstrap/dist/js/bootstrap.js","script","/js/bootstrap.js"],["logbook.itstep.org/js/library/d3.js","script","/js/d3.js"],["logbook.itstep.org/assets/c426aedf/angular/angular.min.js","script","/js/angular.min.js"],["logbook.itstep.org/assets/c426aedf/angular-ui-router/release/angular-ui-router.min.js","script","/js/angular-ui-router.min.js"],["logbook.itstep.org/assets/c426aedf/angular-animate/angular-animate.min.js","script","/js/angular-animate.min.js"],["logbook.itstep.org/assets/c426aedf/angular-aria/angular-aria.min.js","script","/js/angular-aria.min.js"],["logbook.itstep.org/assets/c426aedf/angular-material/angular-material.min.js","script","/js/angular-material.min.js"],["logbook.itstep.org/assets/c426aedf/angular-messages/angular-messages.min.js","script","/js/angular-messages.min.js"],["logbook.itstep.org/assets/c426aedf/angular-local-storage/dist/angular-local-storage.min.js","script","/js/angular-local-storage.min.js"],["logbook.itstep.org/assets/c426aedf/angular-translate/angular-translate.min.js","script","/js/angular-translate.min.js"],["logbook.itstep.org/assets/c426aedf/angular-toArrayFilter/toArrayFilter.js","script","/js/toArrayFilter.js"],["logbook.itstep.org/assets/c426aedf/angular-translate-loader-url/angular-translate-loader-url.min.js","script","/js/angular-translate-loader-url.min.js"],["logbook.itstep.org/assets/c426aedf/raven-js/dist/raven.js","script","/js/raven.js"],["logbook.itstep.org/assets/c426aedf/raven-js/dist/plugins/angular.js","script","/js/angular.js"],["logbook.itstep.org/assets/ad23f1e3/chosen.js","script","/js/chosen.js"],["logbook.itstep.org/assets/ad23f1e3/angular-chosen.min.js","script","/js/angular-chosen.min.js"],["logbook.itstep.org/js/angular/script.js","script","/js/script.js"],["logbook.itstep.org/js/angular/create-graph.js","script","/js/create-graph.js"],["logbook.itstep.org/js/angular/directives.js","script","/js/directives.js"],["logbook.itstep.org/js/angular/base-factory.js","script","/js/base-factory.js"],["logbook.itstep.org/js/angular/base-controller.js","script","/js/base-controller.js"],["logbook.itstep.org/js/angular/signal/controllers/signalCtrl.js","script","/js/signalCtrl.js"],["logbook.itstep.org/js/angular/signal/signal-factory.js","script","/js/signal-factory.js"],["logbook.itstep.org/js/angular/signal/signal-filters.js","script","/js/signal-filters.js"],["logbook.itstep.org/assets/ee725e3c/controllers/classWorkCtrl.js","script","/js/classWorkCtrl.js"],["logbook.itstep.org/assets/ee725e3c/classwork-factory.js","script","/js/classwork-factory.js"],["logbook.itstep.org/assets/5bd3457e/controllers/examsCtrl.js","script","/js/examsCtrl.js"],["logbook.itstep.org/assets/5bd3457e/exams-factory.js","script","/js/exams-factory.js"],["logbook.itstep.org/assets/5bd3457e/controllers/courseWorksCtrl.js","script","/js/courseWorksCtrl.js"],["logbook.itstep.org/assets/ba0d14e1/controllers/homeWorkCtrl.js","script","/js/homeWorkCtrl.js"],["logbook.itstep.org/assets/ba0d14e1/homeworks-factory.js","script","/js/homeworks-factory.js"],["logbook.itstep.org/assets/ba0d14e1/homeworks-filters.js","script","/js/homeworks-filters.js"],["logbook.itstep.org/assets/80079394/controllers/individualCtrl.js","script","/js/individualCtrl.js"],["logbook.itstep.org/assets/80079394/individual-factory.js","script","/js/individual-factory.js"],["logbook.itstep.org/assets/8cc5017e/controllers/newsCtrl.js","script","/js/newsCtrl.js"],["logbook.itstep.org/assets/8cc5017e/news-factory.js","script","/js/news-factory.js"],["logbook.itstep.org/assets/eb0fbe19/controllers/profileCtrl.js","script","/js/profileCtrl.js"],["logbook.itstep.org/assets/eb0fbe19/profile-factory.js","script","/js/profile-factory.js"],["logbook.itstep.org/assets/df1ab708/controllers/reportCtrl.js","script","/js/reportCtrl.js"],["logbook.itstep.org/assets/df1ab708/report-factory.js","script","/js/report-factory.js"],["logbook.itstep.org/assets/c2e35bcc/controllers/scheduleCtrl.js","script","/js/scheduleCtrl.js"],["logbook.itstep.org/assets/c2e35bcc/schedule_factory.js","script","/js/schedule_factory.js"],["logbook.itstep.org/assets/760e8cba/controllers/mainStudCtrl.js","script","/js/mainStudCtrl.js"],["logbook.itstep.org/assets/760e8cba/controllers/sendStudentsMailCtrl.js","script","/js/sendStudentsMailCtrl.js"],["logbook.itstep.org/assets/760e8cba/controllers/studentsCommentCtrl.js","script","/js/studentsCommentCtrl.js"],["logbook.itstep.org/assets/760e8cba/controllers/studentsCtrl.js","script","/js/studentsCtrl.js"],["logbook.itstep.org/assets/760e8cba/controllers/studentProfileCtrl.js","script","/js/studentProfileCtrl.js"],["logbook.itstep.org/assets/760e8cba/students-module.js","script","/js/students-module.js"],["logbook.itstep.org/assets/760e8cba/students-factory.js","script","/js/students-factory.js"],["logbook.itstep.org/assets/a3142541/controllers/tasksCtrl.js","script","/js/tasksCtrl.js"],["logbook.itstep.org/assets/a3142541/tasks-factory.js","script","/js/tasks-factory.js"],["logbook.itstep.org/assets/6a74c1f3/bind_factory.js","script","/js/bind_factory.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindFormsCtrl.js","script","/js/bindFormsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindMainCtrl.js","script","/js/bindMainCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindMaterialsCtrl.js","script","/js/bindMaterialsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindTeachMaterialsCtrl.js","script","/js/bindTeachMaterialsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindCityCtrl.js","script","/js/bindCityCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingMainCtrl.js","script","/js/linkingMainCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingMethodCtrl.js","script","/js/linkingMethodCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingSpecCtrl.js","script","/js/linkingSpecCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/bindAuthorsCtrl.js","script","/js/bindAuthorsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingFormCtrl.js","script","/js/linkingFormCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logsCtrl.js","script","/js/logsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingDirectionCtrl.js","script","/js/linkingDirectionCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/linkingEditSpecCtrl.js","script","/js/linkingEditSpecCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/materialsLogsCtrl.js","script","/js/materialsLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/methodPackageLogsCtrl.js","script","/js/methodPackageLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/mainLogsCtrl.js","script","/js/mainLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/methodLinkingLogsCtrl.js","script","/js/methodLinkingLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/methodBindLogsCtrl.js","script","/js/methodBindLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/controllers/logs/methodPublicSpecLogsCtrl.js","script","/js/methodPublicSpecLogsCtrl.js"],["logbook.itstep.org/assets/6a74c1f3/logs_factory.js","script","/js/logs_factory.js"],["logbook.itstep.org/assets/acd1944e/controllers/groupsCtrl.js","script","/js/groupsCtrl.js"],["logbook.itstep.org/assets/acd1944e/groups-factory.js","script","/js/groups-factory.js"],["logbook.itstep.org/assets/438a8ca5/controllers/portfolioCtrl.js","script","/js/portfolioCtrl.js"],["logbook.itstep.org/assets/438a8ca5/portfolio-factory.js","script","/js/portfolio-factory.js"],["logbook.itstep.org/assets/3e829af4/presents_factory.js","script","/js/presents_factory.js"],["logbook.itstep.org/assets/3e829af4/controllers/presentsCtrl.js","script","/js/presentsCtrl.js"],["logbook.itstep.org/assets/3e829af4/controllers/addMaterialCtrl.js","script","/js/addMaterialCtrl.js"],["logbook.itstep.org/assets/3e829af4/controllers/addHomeWorkCtrl.js","script","/js/addHomeWorkCtrl.js"],["logbook.itstep.org/assets/3e829af4/controllers/addLabWorkCtrl.js","script","/js/addLabWorkCtrl.js"],["logbook.itstep.org/assets/6ab9a3e3/home/controllers/homeCtrl.js","script","/js/homeCtrl.js"],["logbook.itstep.org/assets/6ab9a3e3/home/home-factory.js","script","/js/home-factory.js"],["logbook.itstep.org/assets/6ab9a3e3/dateService.js","script","/js/dateService.js"],["logbook.itstep.org/assets/55f1923b/controllers/certificatesCtrl.js","script","/js/certificatesCtrl.js"],["logbook.itstep.org/assets/55f1923b/certificates_factory.js","script","/js/certificates_factory.js"],["logbook.itstep.org/assets/fc9a707f/controllers/dossierCtrl.js","script","/js/dossierCtrl.js"],["logbook.itstep.org/assets/fc9a707f/dossier-factory.js","script","/js/dossier-factory.js"],["logbook.itstep.org/assets/5d21dd8/controllers/TraficCtrl.js","script","/js/TraficCtrl.js"],["logbook.itstep.org/assets/5d21dd8/traffic-factory.js","script","/js/traffic-factory.js"],["logbook.itstep.org/assets/88e54093/controllers/contentAuthorCtrl.js","script","/js/contentAuthorCtrl.js"],["logbook.itstep.org/assets/88e54093/content-factory.js","script","/js/content-factory.js"]];

// append automatedBlockUrls to blockUrls
blockUrls = blockUrls.concat(automatedBlockUrls);

// console.log(blockUrls);

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
