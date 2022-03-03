var modules = [
  "ui.router",
  "ngMaterial",
  "ngMessages",
  "LocalStorageModule",
  "angular.chosen",
  "pascalprecht.translate",
  "angular-toArrayFilter",
  "tableSort",
];

var app = angular.module("app", modules);

app.run(function ($rootScope, baseHttp) {
  $rootScope.strToTime = function (date, type) {
    if (angular.isDefined(date)) {
      if (!type) {
        if (typeof date === "string") {
          if (date.split("-").length === 3) {
            date = date.replace(/-/g, "/");
          }
        }
      }
      return new Date(date);
    }
  };

  baseHttp.getArrayMarks().success(function (r) {
    $rootScope.arrayMarks = r.reverse();
  });
});

app.run(function (localStorageService, $state) {
  var active_route = localStorageService.get("activeNav");
  if (angular.isDefined(active_route) && angular.isString(active_route)) {
    $state.go(active_route);
  } else {
    localStorageService.set("", "activeNav");
    $state.go("news");
  }
});

app.run(function ($http) {});

app.constant("ACHIEVES", { WORK_IN_PORTFOLIO: 13 });
app.constant("ACHIEVE_TYPES", { ACHIEVE: 0, EVENT: 1 });
app.constant("OVERDUE_DAYS", 10);

app.constant("WAS_TRUE", 1);
app.constant("WAS_FALSE", 0);
app.constant("WAS_LATE", 2);

app.constant("UPLOAD_TYPE_ATTACH_COMMENT_DZ", 15);
app.constant("UPLOAD_TYPE_COVER", 19);

app.constant("SOCIAL_MASKS", {
  facebook: /^(https?:\/\/)?(www\.)?facebook.com\/[\w\.\?\=\&]+/,
  twitter: /^(https?:\/\/)?(www\.)?twitter.com\/[\w\.\?\=\&]+/,
  VK: /^(https?:\/\/)?(www\.)?vk.com\/[\w\.\?\=\&]+/,
  linkedin: /^(https?:\/\/)?(www\.)?linkedin.com\/[\w\.\?\=\&]+/,
});

/**
 * Статус ваучера 0 - не обработан 1 Обработан
 */
app.constant("STATUS_VOUCHER", { NOT_WORKER: 0, WORKER: 1 });
/**
 * Статус оплаты 0 - не оплачен; 1 - Оплачен
 */
app.constant("STATUS_PAYMENTS", { NOT_PAY: 0, SUCCESS: 1 });

/**
 * Типы директорий для файлового сервера.
 */
app.constant("DIRECTORY_TYPE", {
  MATERIAL: "materialsDirId", // Учебные материалы.
  COVER_IMAGE: "coverImageDirId", // Обложки (материалы, дз...).
  HOMEWORK: "homeworkDirId", // Домашние задания.
  PORTFOLIO: "portfolioDirId", // Портфолио.
  EXAM: "examDirId", // Экзамены.
  HOMEWORK_COMMENT_ATTACHMENT: "homeworkCommentAttachDirId", // Комментарии к дз.
});

app.constant("MATERIAL_TYPE", {
  HOMEWORK: 1,
  LESSON: 2,
  LABWORK: 3,
  BOOK: 4,
  VIDEO: 5,
  PRESENTATION: 6,
  QUIZ: 7,
  POSTS: 8,
});

/**
 * Типы оценок за экзамен
 */
app.constant("EXAM_MARKS", {
  TEST_SCORE: -12,
});

app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
  $mdThemingProvider
    .theme("default")
    .primaryPalette("blue")
    .accentPalette("teal")
    .warnPalette("grey")
    .backgroundPalette("grey");

  //var route = localStorageService.get('activeNav');
  //var route = 'news';
  //$urlRouterProvider.otherwise("/" + route);

  $stateProvider
    .state("dossier", {
      url: "/dossier",
      templateUrl: "/index/get-view?template=dossier/index",
      controller: "dossierCtrl",
      controllerAs: "dossierC",
    })
    .state("news", {
      url: "/",
      templateUrl: "/index/get-view?template=news/index",
      controller: "newsCtrl",
    })
    .state("profile", {
      url: "/profile",
      templateUrl: "/index/get-view?template=profile/index",
      controller: "profileCtrl",
    })
    .state("schedulePage", {
      url: "/schedulePage",
      templateUrl: "/index/get-view?template=schedule/index",
      controller: "scheduleCtrl",
    })
    .state("groupsPage", {
      url: "/groupsPage",
      templateUrl: "/index/get-view?template=groups/index",
      controller: "groupsCtrl",
    })
    .state("classWork", {
      url: "/classWork",
      templateUrl: "/index/get-view?template=classwork/index",
      controller: "classWorkCtrl",
    })
    .state("homeWork", {
      url: "/homeWork",
      templateUrl: "/index/get-view?template=homework/index",
      controller: "homeWorkCtrl",
    })
    .state("traffic", {
      url: "/traffic",
      templateUrl: "/index/get-view?template=traffic/index",
      controller: "TraficCtrl",
    })
    .state("tasks", {
      url: "/tasks",
      templateUrl: "/index/get-view?template=tasks/index",
      controller: "tasksCtrl",
    })
    .state("report", {
      url: "/report",
      templateUrl: "/index/get-view?template=report/index",
      controller: "reportCtrl",
    })
    .state("exams", {
      url: "/exams",
      templateUrl: "/index/get-view?template=exams/index",
      controller: "examsCtrl",
    })
    .state("content_author", {
      url: "/content_author",
      templateUrl: "/index/get-view?template=content_author/index",
      controller: "contentAuthorCtrl",
    })
    .state("presents", {
      url: "/presents",
      templateUrl: "/index/get-view?template=presents/index",
      controller: "presentsCtrl",
    })
    .state("portfolio", {
      url: "/portfolio",
      templateUrl: "/index/get-view?template=portfolio/index",
      controller: "portfolioCtrl",
    })
    .state("materials", {
      url: "/materials",
      templateUrl: "/index/get-view?template=bind/materials",
      controller: "materialsCtrl",
    })
    .state("student_info", {
      url: "/student_info",
      templateUrl: "/index/get-view?template=students/index",
      controller: "student_infoCtrl",
    })
    //.state('logs', {
    //    url: "/bind/logs",
    //    templateUrl: "/index/get-view?template=bind/logs",
    //    controller:'logsCtrl'
    //})
    .state("binding_materials", {
      url: "/binding_materials",
      templateUrl: "/index/get-view?template=bind/index",
      controller: "binding_materialsCtrl",
    })
    .state("presents.addMaterial", {
      url: "/addMaterial",
      templateUrl: "/index/get-view?template=presents/addMaterial",
      controller: "addMaterialCtrl",
    })
    .state("presents.addHomeWork", {
      url: "/addHomeWork",
      templateUrl: "/index/get-view?template=presents/addHomeWork",
      controller: "addHomeWorkCtrl",
    })
    .state("presents.addLabWork", {
      url: "/addLabWork",
      templateUrl: "/index/get-view?template=presents/addLabWork",
      controller: "addLabWorkCtrl",
    })
    .state("bind", {
      url: "/bind",
      templateUrl: "/index/get-view?template=bind/index_bind",
      controller: "bindMainCtrl",
    })
    .state("bind.materials", {
      url: "/materials",
      templateUrl: "/index/get-view?template=bind/bind_materials",
      controller: "bindMaterialsCtrl",
    })
    .state("bind.teach_materials", {
      url: "/teach_materials",
      templateUrl: "/index/get-view?template=bind/bind_teach_materials",
      controller: "bindTeachMaterialsCtrl",
    })
    .state("bind.teach_materials_teach", {
      url: "/teach_materials_teach",
      templateUrl:
        "/index/get-view?template=bind/bind_teach_materials_for_teach",
      controller: "bindTeachMaterialsCtrl",
    })
    .state("bind.forms", {
      url: "/forms",
      templateUrl: "/index/get-view?template=bind/bind_forms",
      controller: "bindFormCtrl",
    })
    .state("bind.authors", {
      url: "/authors",
      templateUrl: "/index/get-view?template=bind/bind_authors",
      controller: "bindAuthorsCtrl",
    })
    .state("bind_city", {
      url: "/bind/city",
      templateUrl: "/index/get-view?template=bind/bind_city",
      controller: "bindCityCtrl",
    })
    .state("linking", {
      url: "/linking",
      templateUrl: "/index/get-view?template=bind/index_linking",
      controller: "linkingMainCtrl",
    })
    .state("linking.methodpack", {
      url: "/method",
      templateUrl: "/index/get-view?template=bind/linking_methodpack",
      controller: "linkingMethodCtrl",
    })
    .state("linking.spec", {
      url: "/spec",
      templateUrl: "/index/get-view?template=bind/linking_spec",
      controller: "linkingSpecCtrl",
    })
    .state("linking_form", {
      url: "/linking/form",
      templateUrl: "/index/get-view?template=bind/linking_form",
      controller: "linkingFormCtrl",
    })
    .state("linkingEditSpec", {
      url: "/edit_spec",
      templateUrl: "/index/get-view?template=bind/linking_edit_spec",
      controller: "linkingEditSpecCtrl",
    })
    .state("linkingDirection", {
      url: "/linking/direction",
      templateUrl: "/index/get-view?template=bind/linking_direction",
      controller: "linkingDirectionCtrl",
    })
    .state("students", {
      url: "/students",
      templateUrl: "/index/get-view?template=students/index",
      controller: "mainStudCtrl",
    })
    .state("students.list", {
      url: "/list",
      templateUrl: "/index/get-view?template=students/students",
      controller: "studentsCtrl",
    })
    .state("students.comment", {
      url: "/comment",
      templateUrl: "/index/get-view?template=students/students_comment",
      controller: "studentsCommentCtrl",
    })
    .state("students.send_mail", {
      url: "/send_mail",
      templateUrl: "/index/get-view?template=students/send_mail",
      controller: "sendStudentsMailCtrl",
    })
    .state("stud_profile", {
      url: "/stud_profile",
      templateUrl: "/index/get-view?template=students/student_profile",
      controller: "studentProfileCtrl",
      params: { stud_info: null },
    })
    .state("logs", {
      url: "/logs",
      templateUrl: "/index/get-view?template=bind/logs/index",
      controller: "mainLogsCtrl",
    })
    .state("logs.materials", {
      url: "/materials",
      templateUrl: "/index/get-view?template=bind/logs/materials",
      controller: "materialsLogsCtrl",
    })
    .state("logs.method_package", {
      url: "/method_package",
      templateUrl: "/index/get-view?template=bind/logs/method_package",
      controller: "methodPackageLogsCtrl",
    })
    .state("logs.linking", {
      url: "/linking",
      templateUrl: "/index/get-view?template=bind/logs/linking",
      controller: "methodLinkingLogsCtrl",
    })
    .state("logs.bind", {
      url: "/bind",
      templateUrl: "/index/get-view?template=bind/logs/bind",
      controller: "methodBindLogsCtrl",
    })
    .state("logs.public_spec", {
      url: "/public_spec",
      templateUrl: "/index/get-view?template=bind/logs/public_spec",
      controller: "methodPublicSpecLogsCtrl",
    })
    .state("individual", {
      url: "/individual",
      templateUrl: "/index/get-view?template=individual/index",
      controller: "individualCtrl",
    })
    .state("individual_voucher", {
      url: "/individual/voucher/{identifier}",
      templateUrl: "/index/get-view?template=individual/voucher",
      controller: "individualCtrl",
    });
});

app.factory("httpInterceptor", [
  "$q",
  "$location",
  function ($q, $location) {
    return {
      request: function (config) {
        if (config.url.indexOf("http") !== 0) {
          //не передаем заголовки на внешние подключения типа файлменеджера
          config.headers["Id-Local-Hash"] =
            sessionStorage.getItem("IdLocalHash"); //заголовки для идентификатора http запросов
        }
        return config;
      },
      response: function (response) {
        if (response.status === 403) {
          location.href = "/login/index";
          return $q.reject(response);
        }
        return response || $q.when(response);
      },

      responseError: function (rejection) {
        if (rejection.status === 403) {
          location.href = "/login/index";
          return $q.reject(rejection);
        } else if (rejection.status === 409) {
          //Ошибка если пользователь активной страницы отличается от пользователя авторизации
          location.href = "/auth/logout";
          return $q.reject(response);
        }
        return $q.reject(rejection);
      },
    };
  },
]);

app.config([
  "$httpProvider",
  function ($httpProvider) {
    $httpProvider.interceptors.push("httpInterceptor");
  },
]);
app.config(function ($sceDelegateProvider, $mdDateLocaleProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    "self",
    // Allow loading from outer templates domain.
    "*",
  ]);

  $mdDateLocaleProvider.months = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ];
  $mdDateLocaleProvider.shortMonths = [
    "янв",
    "февр",
    "март",
    "апр",
    "май",
    "июнь",
    "июль",
    "авг",
    "сент",
    "окт",
    "нояб",
    "дек",
  ];
  $mdDateLocaleProvider.days = [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ];
  $mdDateLocaleProvider.shortDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  $mdDateLocaleProvider.firstDayOfWeek = 1;
  $mdDateLocaleProvider.formatDate = function (date) {
    if (angular.isDefined(date)) {
      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return day + "-" + (monthIndex + 1) + "-" + year;
    } else {
      return "";
    }
  };
});

app.config([
  "$translateProvider",
  function ($translateProvider) {
    $translateProvider.useUrlLoader("/auth/load-message", { async: false });
    $translateProvider.preferredLanguage("ru");
    $translateProvider.useSanitizeValueStrategy("escape");
  },
]);

app.run(function ($translate, $mdDateLocale, $filter) {
  $translate.onReady(function () {
    $mdDateLocale.months = [];
    $mdDateLocale.shortMonths = [];
    $mdDateLocale.days = [];
    $mdDateLocale.shortDays = [];

    for (var i = 0; i < 12; i++) {
      $mdDateLocale.months.push($filter("translate")("month_name_" + i));
      $mdDateLocale.shortMonths.push(
        $filter("translate")("month_short_name_" + i)
      );
    }

    for (var j = 0; j < 7; j++) {
      $mdDateLocale.days.push($filter("translate")("day_long_" + j));
      $mdDateLocale.shortDays.push($filter("translate")("day_short_" + j));
    }
  });
});

app.filter("toArray", function () {
  return function (obj) {
    var result = [];
    angular.forEach(obj, function (val, key) {
      if (angular.isDefined(val) && val != "" && angular.isDefined(key)) {
        result.push(val);
      }
    });
    return result;
  };
});

$("#burger-btn").on("click", function (e) {
  e.preventDefault();
  $(".side-nav").animate({ left: "0px" });
  $(".loyout").fadeIn();
});

$("body:not(.left_navbar)").on("click", function (e) {
  var div = $(".langs_li a.btn-floating.btn-large");
  if (!div.is(e.target) && div.has(e.target).length === 0) {
    if ($(".side-nav").css("left") == "0px") {
      $(".side-nav").animate({ left: "-350px" });
      $(".loyout").fadeOut();
    }
  }
});

$(document).on("click", ".fixed-action-btn li", function () {
  var curLang = $(this).find("i").html();
  $(".fixed-action-btn .btn-large .material-icons").html(curLang);
});
