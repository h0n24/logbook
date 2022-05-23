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
    "logbook.itstep.org/assets/e949524c/controllers/homeWorkCtrl.js",
    "script",
    "/js/homeWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/bd361891/controllers/classWorkCtrl.js",
    "script",
    "/js/classWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/bd361891/classwork-factory.js",
    "script",
    "/js/classwork-factory.js",
  ],
  [
    "logbook.itstep.org/assets/89703d3/controllers/examsCtrl.js",
    "script",
    "/js/examsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/89703d3/exams-factory.js",
    "script",
    "/js/exams-factory.js",
  ],
  [
    "logbook.itstep.org/assets/89703d3/controllers/courseWorksCtrl.js",
    "script",
    "/js/courseWorksCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/e949524c/homeworks-factory.js",
    "script",
    "/js/homeworks-factory.js",
  ],
  [
    "logbook.itstep.org/assets/e949524c/homeworks-filters.js",
    "script",
    "/js/homeworks-filters.js",
  ],
  [
    "logbook.itstep.org/assets/d343d539/controllers/individualCtrl.js",
    "script",
    "/js/individualCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/d343d539/individual-factory.js",
    "script",
    "/js/individual-factory.js",
  ],
  [
    "logbook.itstep.org/assets/df8147d3/controllers/newsCtrl.js",
    "script",
    "/js/newsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/df8147d3/news-factory.js",
    "script",
    "/js/news-factory.js",
  ],
  [
    "logbook.itstep.org/assets/b84bf8b4/controllers/profileCtrl.js",
    "script",
    "/js/profileCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/b84bf8b4/profile-factory.js",
    "script",
    "/js/profile-factory.js",
  ],
  [
    "logbook.itstep.org/assets/8c5ef1a5/controllers/reportCtrl.js",
    "script",
    "/js/reportCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/8c5ef1a5/report-factory.js",
    "script",
    "/js/report-factory.js",
  ],
  [
    "logbook.itstep.org/assets/91a71d61/controllers/scheduleCtrl.js",
    "script",
    "/js/scheduleCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/91a71d61/schedule_factory.js",
    "script",
    "/js/schedule_factory.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/controllers/mainStudCtrl.js",
    "script",
    "/js/mainStudCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/controllers/sendStudentsMailCtrl.js",
    "script",
    "/js/sendStudentsMailCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/controllers/studentsCommentCtrl.js",
    "script",
    "/js/studentsCommentCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/controllers/studentsCtrl.js",
    "script",
    "/js/studentsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/students-module.js",
    "script",
    "/js/students-module.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/students-factory.js",
    "script",
    "/js/students-factory.js",
  ],
  [
    "logbook.itstep.org/assets/254aca17/controllers/studentProfileCtrl.js",
    "script",
    "/js/studentProfileCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/f05063ec/controllers/tasksCtrl.js",
    "script",
    "/js/tasksCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/f05063ec/tasks-factory.js",
    "script",
    "/js/tasks-factory.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/bind_factory.js",
    "script",
    "/js/bind_factory.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindFormsCtrl.js",
    "script",
    "/js/bindFormsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindMainCtrl.js",
    "script",
    "/js/bindMainCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindMaterialsCtrl.js",
    "script",
    "/js/bindMaterialsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindTeachMaterialsCtrl.js",
    "script",
    "/js/bindTeachMaterialsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindCityCtrl.js",
    "script",
    "/js/bindCityCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingMainCtrl.js",
    "script",
    "/js/linkingMainCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingMethodCtrl.js",
    "script",
    "/js/linkingMethodCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingSpecCtrl.js",
    "script",
    "/js/linkingSpecCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/bindAuthorsCtrl.js",
    "script",
    "/js/bindAuthorsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingFormCtrl.js",
    "script",
    "/js/linkingFormCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logsCtrl.js",
    "script",
    "/js/logsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingDirectionCtrl.js",
    "script",
    "/js/linkingDirectionCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/linkingEditSpecCtrl.js",
    "script",
    "/js/linkingEditSpecCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/materialsLogsCtrl.js",
    "script",
    "/js/materialsLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/methodPackageLogsCtrl.js",
    "script",
    "/js/methodPackageLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/mainLogsCtrl.js",
    "script",
    "/js/mainLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/methodLinkingLogsCtrl.js",
    "script",
    "/js/methodLinkingLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/methodBindLogsCtrl.js",
    "script",
    "/js/methodBindLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/controllers/logs/methodPublicSpecLogsCtrl.js",
    "script",
    "/js/methodPublicSpecLogsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/3930875e/logs_factory.js",
    "script",
    "/js/logs_factory.js",
  ],
  [
    "logbook.itstep.org/assets/ff95d2e3/controllers/groupsCtrl.js",
    "script",
    "/js/groupsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/ff95d2e3/groups-factory.js",
    "script",
    "/js/groups-factory.js",
  ],
  [
    "logbook.itstep.org/assets/10ceca08/controllers/portfolioCtrl.js",
    "script",
    "/js/portfolioCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/10ceca08/portfolio-factory.js",
    "script",
    "/js/portfolio-factory.js",
  ],
  [
    "logbook.itstep.org/assets/6dc6dc59/presents_factory.js",
    "script",
    "/js/presents_factory.js",
  ],
  [
    "logbook.itstep.org/assets/6dc6dc59/controllers/presentsCtrl.js",
    "script",
    "/js/presentsCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/6dc6dc59/controllers/addMaterialCtrl.js",
    "script",
    "/js/addMaterialCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/6dc6dc59/controllers/addHomeWorkCtrl.js",
    "script",
    "/js/addHomeWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/6dc6dc59/controllers/addLabWorkCtrl.js",
    "script",
    "/js/addLabWorkCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/39fde54e/home/controllers/homeCtrl.js",
    "script",
    "/js/homeCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/39fde54e/home/home-factory.js",
    "script",
    "/js/home-factory.js",
  ],
  [
    "logbook.itstep.org/assets/39fde54e/dateService.js",
    "script",
    "/js/dateService.js",
  ],
  [
    "logbook.itstep.org/assets/6b5d496/controllers/certificatesCtrl.js",
    "script",
    "/js/certificatesCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/6b5d496/certificates_factory.js",
    "script",
    "/js/certificates_factory.js",
  ],
  [
    "logbook.itstep.org/assets/afde36d2/controllers/dossierCtrl.js",
    "script",
    "/js/dossierCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/afde36d2/dossier-factory.js",
    "script",
    "/js/dossier-factory.js",
  ],
  [
    "logbook.itstep.org/assets/56965b75/controllers/TraficCtrl.js",
    "script",
    "/js/TraficCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/56965b75/traffic-factory.js",
    "script",
    "/js/traffic-factory.js",
  ],
  [
    "logbook.itstep.org/assets/dba1063e/controllers/contentAuthorCtrl.js",
    "script",
    "/js/contentAuthorCtrl.js",
  ],
  [
    "logbook.itstep.org/assets/dba1063e/content-factory.js",
    "script",
    "/js/content-factory.js",
  ],
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
  [
    "logbook.itstep.org/auth/get-marks-selects",
    "xmlhttprequest",
    "/resources/get-marks-selects.json",
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
