var app_module = angular.module("app");

app_module.controller("homeWorkCtrl", [
  "$scope",
  "homeworkHttp",
  "$location",
  "$mdDialog",
  "$filter",
  "$compile",
  "$sce",
  "$templateRequest",
  "$mdToast",
  "$element",
  "baseHttp",
  "localStorageService",
  "DIRECTORY_TYPE",
  "$rootScope",
  "reportHttp",
  homeWorkCtrl,
]);

function homeWorkCtrl(
  $scope,
  homeworkHttp,
  $location,
  $mdDialog,
  $filter,
  $compile,
  $sce,
  $templateRequest,
  $mdToast,
  $element,
  baseHttp,
  localStorageService,
  DIRECTORY_TYPE,
  $rootScope,
  reportHttp
) {
  // Значение для сброса позиционирования списка дз.
  const CLEAR_OFFSET = 0;

  $scope.minDays = 1; // Минимум дней для отображения дз.
  $scope.resetValuePosition = -1; // Значение сброса позиционирования (на странице)
  $scope.oldStud = 0; // Значение для определения старого студента.
  $scope.newStudent = 1; // Значение для определения нового студента.
  $scope.incrementIdxStud = 1; // Значение на которое будет увеличиваться каждая итерация цикла вывода дз.
  $scope.manuallyMark = 0; // Тип ручных оценок.
  $scope.countHmInUp = 3; // Кол-во дз для корректного позиционирования блока в html.
  $scope.minMark = 0; // Значение минимальной оценки.
  $scope.noMark = "-"; // Значение для отсутствия оценки.
  $scope.actievTabType = {
    // номер активного таба 1 - домашние работы, 2 - лабораторные, 3 - пересдача
    new_hw: 1,
    new_lab: 2,
    request_stud: 3,
  };

  let d = new Date();

  $scope.years = []; // годы для фильтра
  $scope.months = []; // месяцы для фильтра

  // модель для селектов выбора года и месяца
  $scope.form = {
    year: "",
    month: "",
  };

  $scope.maxYear = d.getFullYear();
  $scope.minYear = 2014;

  /**
   * для сортировки преобразуем строку в число
   * @param item
   * @returns {number}
   */
  $scope.transformOrderToInt = function (item) {
    return parseInt(item.order);
  };

  $scope.getStartDate = function () {
    for (let i = $scope.minYear, j = 0; i <= $scope.maxYear; i++, j++) {
      $scope.years[j] = "" + i;
    }
  };
  $scope.getStartDate();

  // 0- несданные, 1 - проверенные, 2- новые, 3- пересдача, 4- просроченные  - используется для классов css
  $scope.hwStatuses = [
    "hw_not-loaded",
    "hw_checked",
    "hw_new",
    "hw_retake",
    "hw_overdue",
  ];

  $scope.showPrerenderedDialog = function () {
    if (
      !!$scope.new_hw.length ||
      !!$scope.new_lab.length ||
      !!$scope.request_stud.length
    ) {
      $mdDialog.show({
        contentElement: "#myDialog",
        parent: angular.element(document.body),
        clickOutsideToClose: true,
      });
    } else {
      $mdDialog.hide();
    }
  };

  $scope.hidemyDialog = function () {
    $mdDialog.hide();
  };

  $scope.filter = {};
  $scope.oldStud = false;
  $scope.ospr = 0;
  $scope.transferred = false;
  $scope.newHwObject = [];
  $scope.activeHwCount = 3;
  $scope.activeLwCount = 3;
  $scope.activeRwCount = 3;
  $rootScope.deletingDz = {};
  $scope.allGroups = false;
  $scope.sortType = "stud_date";
  $scope.typesObj = {};
  $scope.overdue_info = {};

  $scope.getStartData = function () {
    $scope.allGroups = false; // Сбрасываем кнопку 'Показать все группы' до значения по-умолчанию - false.
    homeworkHttp.getGroupsSpec({ type: $scope.ospr }).success(function (r) {
      if (r?.groups_spec && typeof r.groups_spec !== "undefined") {
        $scope.filter_data = r.groups_spec;
        $scope.months = r.months;
        $scope.setDefaultGroup(); //устанавливаем дефолтное значение
        $scope.setDefaultSpec(); //устанавливаем дефолтное значение
        $scope.getStudents();
        $scope.setLimit();
        $scope.offset = CLEAR_OFFSET;
        $scope.getHomeworks();
      } else {
        delete $scope.filter_data;
      }
    });
  };
  var myWidth = window.innerWidth;
  $scope.setLimit = function () {
    if (myWidth > 1400) {
      $scope.limit = 10;
    } else if (myWidth < 1400 && myWidth > 1300) {
      $scope.limit = 8;
    } else if (myWidth < 1300 && myWidth > 1100) {
      $scope.limit = 7;
    } else if (myWidth < 1100 && myWidth > 1000) {
      $scope.limit = 6;
    } else if (myWidth < 1000 && myWidth > 900) {
      $scope.limit = 5;
    } else if (myWidth < 900 && myWidth > 800) {
      $scope.limit = 4;
    } else if (myWidth < 800 && myWidth > 700) {
      $scope.limit = 3;
    } else if (myWidth < 700 && myWidth > 600) {
      $scope.limit = 2;
    } else {
      $scope.limit = 1;
    }
  };

  $scope.setDefaultSpec = function () {
    var max = 0;
    if ($scope.filter_data.length > 0) {
      angular.forEach(
        $scope.filter_data[$scope.filter.group].data,
        function (value, key) {
          if (+max < +value.order) {
            max = value.order;
            $scope.filter.spec = value.id_spec;
          }
        }
      );
    }
  };

  $scope.setDefaultGroup = function () {
    let max = 0;
    angular.forEach($scope.filter_data, function (value, key) {
      if (+max < +value.order) {
        max = value.order;
        $scope.filter.group = value.id_tgroups;
      }
    });
  };

  $scope.changeGroup = function () {
    if (
      $scope.filter_data[$scope.filter.group] &&
      $scope.filter_data[$scope.filter.group].data
    ) {
      $scope.offset = CLEAR_OFFSET;
      $scope.setDefaultSpec();
      $scope.getStudents();
      $scope.getHomeworks();
    }
  };

  $scope.getStudents = function () {
    var data = {
      id_tgroups: $scope.filter.group,
      spec: $scope.filter.spec,
      transferred: $scope.transferred,
    };
    homeworkHttp.getStudents(data).success(function (r) {
      $scope.stud_list = r;
    });
  };

  $scope.changeSpec = function () {
    $scope.offset = CLEAR_OFFSET;
    $scope.getHomeworks();
    $scope.getStudents();
  };

  $scope.changeDate = function () {
    $scope.offset = CLEAR_OFFSET;
    $scope.getHomeworks();
    $scope.getStudents();
  };

  $scope.getHomeworks = function () {
    homeworkHttp
      .getHomeworks({
        id_tgroups: $scope.filter.group,
        id_spec: $scope.filter.spec,
        limit: $scope.limit,
        offset: $scope.offset,
        type: $scope.ospr,
        transferred: $scope.transferred,
        year: $scope.form.year,
        month: $scope.form.month,
      })
      .success(function (r) {
        $scope.table_body = r.table_body;
        $scope.table_header_full = r.table_header;
        $scope.table_header =
          $scope.table_header_full.length > $scope.limit
            ? $scope.table_header_full.slice(
                $scope.offset,
                $scope.offset + $scope.limit
              )
            : $scope.table_header_full;
        $scope.startPosition = $scope.table_header_full.length - $scope.offset;
        $scope.endPosition =
          $scope.table_header_full.length > $scope.offset + $scope.limit
            ? $scope.table_header_full.length - $scope.offset - $scope.limit + 1
            : 1;
        $scope.table_header_full.forEach((item) => {
          $scope.overdue_info[item.id_domzad] = item.overdue;
        });
      });
  };

  /**
   * Отправка данных с оценками.
   *
   * @param data[] - Данные с оценками.
   */
  $scope.setMarkDzSend = function (data) {
    $scope.startMarkDz = true;
    homeworkHttp.setMark(data).success(function (r) {
      $scope.startMarkDz = false;
      $scope.removeExitEvent();

      var dataMark = localStorageService.get("markDzStud");
      angular.forEach(data.marks, function (value, key) {
        delete dataMark[key];
      });
      if (dataMark == {}) {
        localStorageService.remove("markDzStud");
      } else {
        localStorageService.set("markDzStud", dataMark);
      }

      if (r.error) {
        // Materialize.toast(r.error, 4000, 'red');
        $mdToast.show({
          hideDelay: 4000,
          position: "top right",
          // template: '<md-toast class="md-toast red">' + r.error.mark[0] + '</md-toast>',
          template: '<md-toast class="md-toast red">' + r.error + "</md-toast>",
        });
      } else {
        // Materialize.toast(r.success, 4000, 'green');
        $mdToast.show({
          hideDelay: 4000,
          position: "top right",
          template:
            '<md-toast class="md-toast green">' + r.success + "</md-toast>",
        });

        if (r.data) {
          angular.forEach(r.data, function (value, key) {
            if (angular.isDefined($scope.table_body[value["stud"]])) {
              $scope.table_body[value["stud"]][value["id"]].id_domzadstud =
                value["id_domzadstud"];
            }
          });
        }
      }
    });
  };

  function exitEvent(e) {
    var confirmationMessage = "o/";
    e.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  /**
   * Добавляем событие чтобы не закрывали вкладку пока не сохранены оценки
   */
  $scope.addExitEvent = function () {
    window.addEventListener("beforeunload", exitEvent);
  };

  /**
   * Удаляем событие чтобы не закрывали вкладку пока не сохранены присутствующие или оценки
   */
  $scope.removeExitEvent = function () {
    window.removeEventListener("beforeunload", exitEvent);
  };

  $scope.changeOffset = function (k) {
    if ($scope.offset > 0 || k > 0) {
      $scope.offset = $scope.offset + k * $scope.limit;
    }
    if ($scope.table_header_full.length >= $scope.offset) {
      $scope.table_header = $scope.table_header_full.slice(
        $scope.offset,
        $scope.offset + $scope.limit
      );
      $scope.startPosition = $scope.table_header_full.length - $scope.offset;
      $scope.endPosition =
        $scope.table_header_full.length > $scope.offset + $scope.limit
          ? $scope.table_header_full.length - $scope.offset - $scope.limit + 1
          : 1;
    } else {
      $scope.offset = $scope.offset - k * $scope.limit;
    }
  };

  $scope.changeTranferred = function () {
    if ($scope.ActiveComment) {
      $scope.ActiveComment.id_domzadstud = 0;
    }
    $scope.transferred = !$scope.transferred;
    $scope.getStudents();
    $scope.getHomeworks();
  };

  /**
   *
   * Метод для удалния ДЗ
   *
   * @param id
   * @param comment
   * @param commentAttach
   */
  $scope.deleteHomework = function (id, comment, commentAttach) {
    if (angular.isDefined(commentAttach)) {
      //если есть прикрепленный файл к комментарию
      baseHttp.getFileUploadToken().success(function (credentials) {
        if (angular.isDefined(credentials.token)) {
          baseHttp
            .uploadFile(
              credentials,
              commentAttach,
              DIRECTORY_TYPE.HOMEWORK_COMMENT_ATTACHMENT
            )
            .success(function (rU) {
              if (angular.isDefined(rU[0].link)) {
                $scope.baseDeleteHw({
                  id_domzad: id,
                  comment: comment,
                  comment_attach: rU[0].link,
                });
              }
            });
        }
      });
    } else {
      $scope.baseDeleteHw({ id_domzad: id, comment: comment });
    }
  };

  /**
   * Базовый метод для удаление ДЗ
   *
   * @param data
   */
  $scope.baseDeleteHw = function (data) {
    homeworkHttp.deleteHomework(data).success(function () {
      $scope.getStudents();
      $scope.getHomeworks();
      $scope.getModalData();
    });
  };

  $scope.downloadHomework = function (url) {
    window.open(url);
  };

  $scope.downloadTeachHomework = function (url) {
    window.open(url);
  };

  /**
   * загрузка данных для модального окна с непроверенными заданиями, указание активной вкладки
   * @param activeTab - активный  таб в модальном окне
   */
  $scope.getModalData = function (activeTab, isShowPrerender) {
    homeworkHttp.getNewHomework().success(function (r) {
      $scope.new_hw = r.homework;
      $scope.new_lab = r.lab_work;
      $scope.request_stud = r.requests;
      let arrRequest = [null, r.homework, r.lab_work, r.requests]; // для задания активной вкладки. Нулевого элемента нет, т.к. нумерация вкладок с единицы
      $scope.studWorkData =
        (r.homework.length && r.homework) ||
        (r.lab_work.length && r.lab_work) ||
        (r.requests.length && r.requests) ||
        null;

      //закрытие модального окна, если нет данных для отображения
      if (
        !$scope.new_hw.length &&
        !$scope.new_lab.length &&
        !$scope.request_stud.length
      ) {
        $mdDialog.hide();
        return;
      }
      if (r.new_true && myWidth > 992) {
        if (isShowPrerender) {
          $scope.showPrerenderedDialog();
        }
        // если активная владка задана явно - отображаем ее содержимое
        if (activeTab) {
          $scope.studWorkData =
            activeTab == $scope.actievTabType.new_hw
              ? $scope.new_hw
              : activeTab == $scope.actievTabType.new_lab
              ? $scope.new_lab
              : $scope.request_stud;
          $scope.activeHome = activeTab;
        }
        // если вкладка была задана ранее и в ней остались не проверенные дз - отображаем ее
        else if (
          $scope.activeHome &&
          arrRequest[$scope.activeHome].length > 0
        ) {
          $scope.studWorkData = arrRequest[$scope.activeHome];
        }
        // в остальных случаях отображаем первую вкладку, в которой есть не проверенные дз
        else {
          $scope.activeHome = !!$scope.new_hw.length
            ? 1
            : !!$scope.new_lab.length
            ? 2
            : !!$scope.request_stud.length
            ? 3
            : null;
        }
      }
    });
  };

  $scope.convertTime = function (start, end) {
    return start && end
      ? `${start.split(":").slice(0, 2).join(":")} - ${end
          .split(":")
          .slice(0, 2)
          .join(":")}`
      : "";
  };

  /**
   *
   * @param id
   * @param inDialog - флаг для отображения или закрытия модального окна с не проверенными дз
   */
  $scope.showConfirmDeleteDzStud = function (id, inDialog) {
    var confirm = $mdDialog
      .confirm({
        templateUrl: "views/templates/confirmDeleteDz.html",
        clickOutsideToClose: true,
        skipHide: true,
        controller: ConfirmDzDialogController,
      })
      .title($filter("translate")("confirm_dz_stud"))
      .ok($filter("translate")("ok"))
      .cancel($filter("translate")("cancel"));

    $mdDialog.show(confirm).then(
      function () {
        $scope.deleteHomework(
          id,
          $rootScope.deletingDz.comment,
          $rootScope.deletingDz.file_attach
        );
        if (window.screen.width > 992 && inDialog) {
          $scope.showPrerenderedDialog();
        } else {
          $mdDialog.hide();
        }
      },
      function (e) {}
    );
  };

  /**
   * Закрытие $mdDialog окна
   */
  $scope.mdDialogClose = function () {
    $mdDialog.cancel();
  };
  /**
   * закрытие кастомной модалки
   */
  $scope.closeModal = function () {
    $scope.ActiveComment = {};
  };

  function ConfirmDzDialogController($scope, $mdDialog, $rootScope) {
    $scope.abort = function () {
      $mdDialog.cancel();
    };

    $scope.setParams = function (params) {
      if (angular.isDefined(params)) {
        if (
          angular.isDefined(params.comment) ||
          angular.isDefined(params.file_attach)
        ) {
          $rootScope.deletingDz = params;
          $mdDialog.hide();
        } else {
          $rootScope.deletingDz = {};
        }
      } else {
        $mdToast.show({
          hideDelay: 4000,
          position: "top right",
          template:
            '<md-toast class="md-toast red">' +
            $filter("translate")("write_reason_delete_dz") +
            "</md-toast>",
        });
      }
    };
  }

  $scope.deleteHomeworkTeach = function (id) {
    var confirm = $mdDialog.confirm({
      templateUrl: "views/templates/confirms.html",
    });
    confirm
      .title($filter("translate")("confirm_delete_dz"))
      .textContent($filter("translate")("confirm_delete_dz_teach"))
      .ok($filter("translate")("ok"))
      .cancel($filter("translate")("cancel"));

    $mdDialog.show(confirm).then(function () {
      homeworkHttp.deleteTeachHomework({ id_domzad: id }).success(function () {
        $scope.getHomeworks();
      });
    });
  };

  $scope.saveComment = function (id, comment, idStud, attach, works) {
    if (angular.isDefined(attach)) {
      baseHttp.getFileUploadToken().success(function (credentials) {
        if (angular.isDefined(credentials.token)) {
          baseHttp
            .uploadFile(
              credentials,
              attach,
              DIRECTORY_TYPE.HOMEWORK_COMMENT_ATTACHMENT
            )
            .success(function (rU) {
              if (angular.isDefined(rU[0].link)) {
                $scope.saveCommentBase(id, comment, idStud, rU[0].link, works);
              }
            })
            .error(function (eR) {
              // Если мы не смогли отправить файл на сервер выбрасываем ошибку приложения
              $mdToast.show({
                hideDelay: 4000,
                position: "top right",
                template:
                  '<md-toast class="md-toast red">' +
                  $filter("translate")("file_upload_server_error_lb_hw") +
                  "</md-toast>",
              });
            });
        }
      });
    } else {
      $scope.saveCommentBase(id, comment, idStud);
    }

    return works;
  };

  /**
   * старая логика, сохранение комментария
   * @param id - id_domzad, id домашнего задания
   * @param comment - комментарий к ДЗ
   * @param idStud - stud_stud, id студента
   * @param filename - file_attach, прикрепленный файл
   * @param works - ActiveComment - весь объект с инфой о студенте и ДЗ
   * @returns {*}
   */
  $scope.saveCommentBase = function (id, comment, idStud, filename, works) {
    homeworkHttp
      .saveComment({
        id: id,
        comment: comment,
        id_stud: idStud,
        attach: filename,
      })
      .success(function (r) {
        if (r.error) {
          $mdToast.show({
            hideDelay: 4000,
            position: "top right",
            template:
              '<md-toast class="md-toast red">' + r.error + "</md-toast>",
          });
        } else {
          if (angular.isDefined(works)) {
            works.comment_attach = r.attach;
            works.comment_attach_file = r.attach_name;
          }
          $mdToast.show({
            hideDelay: 4000,
            position: "top right",
            template:
              '<md-toast class="md-toast green">' + r.success + "</md-toast>",
          });
        }
      });
    return works;
  };

  /**
   * подвтвердить пересдачу
   * @param id
   * @param type
   * @param indexHw
   */
  $scope.approveRequest = function (id, type, ActiveStudHwNewValue) {
    homeworkHttp.approveRequest({ type: type, id: id }).success(function (r) {
      if (r.error) {
        // Materialize.toast(r.error, 4000, 'red');
        $mdToast.show({
          hideDelay: 4000,
          position: "top right",
          template: '<md-toast class="md-toast red">' + r.error + "</md-toast>",
        });
      } else {
        angular.forEach($scope.studWorkData, function (value, key) {
          if (value.id == id) {
            $scope.studWorkData[key].mark = r.homework.mark;
            $scope.request_stud[key].mark = r.homework.mark;
            $scope.studWorkData[key].bad_dz = r.homework.bad_dz;
            $scope.request_stud[key].bad_dz = r.homework.bad_dz;
          }
        });
        if (ActiveStudHwNewValue) {
          ActiveStudHwNewValue.bad_dz = r.homework.bad_dz;
          ActiveStudHwNewValue.mark = r.homework.mark;
        }

        // при отклонении дз обновляем модалку и таблицу с ДЗ
        if (type == 0) {
          $scope.getHomeworks();
          $scope.getModalData();
        }
        // Materialize.toast(r.success, 4000, 'green');
        $mdToast.show({
          hideDelay: 4000,
          position: "top right",
          template:
            '<md-toast class="md-toast green">' + r.success + "</md-toast>",
        });
      }
    });
  };

  $scope.showComment = function (commentObj) {
    var marksBlock = $sce.getTrustedResourceUrl(
      "views/templates/homeworkComment.html"
    );
    $scope.ActiveComment = commentObj;
    $templateRequest(marksBlock).then(
      function (template) {
        $compile(
          $("#comment_" + commentObj.id_domzadstud)
            .html(template)
            .contents()
        )($scope);
      },
      function () {
        // An error has occurred
      }
    );
  };

  /**
   * отображение модального окна с комментарием преподавателя
   */
  $scope.showTeacherCommentModal = function () {
    $mdDialog.show({
      templateUrl: "views/templates/homeworkComment.html",
      scope: $scope,
      clickOutsideToClose: true,
      preserveScope: true,
    });
  };

  /**
   * отображение меню по работе с д/з студента (просмотр д/з, комментировать, удалить)
   * @param commentObj
   */
  $scope.showCommentMenu = function (commentObj) {
    var marksBlock = $sce.getTrustedResourceUrl(
      "views/templates/homeworkCommon.html"
    );
    $scope.ActiveComment = commentObj;
    $templateRequest(marksBlock).then(
      function (template) {
        $compile(
          $("#comment1_" + commentObj.id_domzadstud)
            .html(template)
            .contents()
        )($scope);
      },
      function () {
        // An error has occurred
      }
    );
  };

  /**
   * Удаления файла-вложения к комментарию дз.
   * @param idDz
   * @param idStud
   * @param obj
   * @returns {*}
   */
  $scope.deleteAttachComment = function (idDz, idStud, obj) {
    homeworkHttp
      .deleteAttachComment({ id: idDz, id_stud: idStud })
      .success(function (r) {
        if (r.error) {
          $mdToast.show({
            hideDelay: 4000,
            position: "top right",
            template:
              '<md-toast class="md-toast red">' + r.error + "</md-toast>",
          });
        } else {
          $mdToast.show({
            hideDelay: 4000,
            position: "top right",
            template:
              '<md-toast class="md-toast green">' + r.success + "</md-toast>",
          });
          obj.comment_attach = null;
          obj.comment_attach_file = null;
          obj.file_attach = null;
          $scope.ActiveStudHw.comment_attach = null;
          $scope.ActiveStudHw.comment_attach_file = null;
          $scope.ActiveStudHw.file_attach = null;
        }
      });
    return obj;
  };

  $scope.validateCommentLength = function (commentObj) {
    // console.log(commentObj, commentObj.coment);
    // if (angular.isDefined(commentObj.coment)) {
    //   commentObj.coment =
    //     commentObj.coment.length > 1000
    //       ? commentObj.coment.slice(0, 1000)
    //       : commentObj.coment;
    // }

    return commentObj;
  };

  /**
   *  Получение списка групп по которым препод давал ДЗ
   */
  $scope.getGroups = function () {
    $scope.allGroups = !$scope.allGroups;
    homeworkHttp
      .getGroupsSpec({ type: $scope.ospr, all_groups: $scope.allGroups })
      .success(function (r) {
        if (r?.groups_spec && typeof r.groups_spec !== "undefined") {
          $scope.filter_data = r.groups_spec;
          $scope.offset = CLEAR_OFFSET;
          if (
            $scope.filter_data[$scope.filter.group] &&
            $scope.filter_data[$scope.filter.group].data
          ) {
            $scope.setDefaultGroup();
            $scope.setDefaultSpec();
            $scope.getStudents();
            $scope.getHomeworks();
          }
        } else {
          delete $scope.filter_data;
        }
      });
  };

  /**
   * Развернутое отображение темы дз
   * @param e
   */
  $scope.showTheme = function (e) {
    if (
      e.target.matches(".hw-md_theme__more") ||
      e.target.matches(".hw-md_single_theme__more")
    ) {
      e.currentTarget.classList.add("open");
    }
  };

  /**
   * показ модального окна с д/з студента
   * @param studHw
   * @param isNewModal - флаг, откуда открыта модалка. Если из общей таблицы, то не делаем вызов новых ДЗ.
   */
  $scope.showHomeworkStud = function (studHw, isNewModal) {
    //обнуление файла при открытии окна
    $scope.teachFile = null;
    $scope.ActiveStudHw = studHw;
    $scope.ActiveStudHwNewValue = angular.copy(studHw);
    $mdDialog.show({
      templateUrl: "views/templates/homeworkStud.html",
      scope: $scope,
      clickOutsideToClose: true,
      preserveScope: true,
      onRemoving: function (event, removePromise) {
        if (isNewModal) {
          $scope.showPrerenderedDialog();
        }
      },
    });
  };

  /**
   * Сохранение файла на файловый сервер, возвращаем промис, чтобы можно было ссылку на файл получать синхронно
   * @param id - id домашнего задания
   * @param idStud
   * @param attach
   * @param works
   * @returns {Promise<any>}
   */
  $scope.saveCommentFile = function (id, idStud, attach) {
    return new Promise((resolve, reject) => {
      if (attach) {
        baseHttp.getFileUploadToken().success(function (credentials) {
          if (angular.isDefined(credentials.token)) {
            baseHttp
              .uploadFile(
                credentials,
                attach,
                DIRECTORY_TYPE.HOMEWORK_COMMENT_ATTACHMENT
              )
              .success((res) => {
                resolve(res);
              })
              .error(function (eR) {
                // Если мы не смогли отправить файл на сервер выбрасываем ошибку приложения
                $mdToast.show({
                  hideDelay: 4000,
                  position: "top right",
                  template:
                    '<md-toast class="md-toast red">' +
                    $filter("translate")("file_upload_server_error_lb_hw") +
                    "</md-toast>",
                });
                //reject - только если не смогли загрузить файл.
                reject();
              });
          }
        });
      } else {
        resolve();
      }
    });
  };

  /**
   * перевод строки в число
   * @param str
   * @returns {number}
   */
  $scope.toNumber = function (str) {
    return parseInt(str);
  };

  /**
   * Сохранение ответа на ДЗ - ссылка на файл от препода, оценка, комментарий преподавателя
   * @param studDz
   * @param isNewHw - фаг, сохраняется ли дз из модалки непроверенных домашних(а так же перездача и лаб. работы)
   * указывает закрывать модалку после сохранения ДЗ или нет
   */
  $scope.saveStudHw = function (studDz, isNewHw) {
    if (studDz.mark <= 6 && !studDz.coment) {
      $mdToast.show({
        hideDelay: 4000,
        position: "top right",
        template:
          '<md-toast class="md-toast red">' +
          $filter("translate")("comment_save_error") +
          "</md-toast>",
      });
      return;
    }
    $scope
      .saveCommentFile(
        studDz.id_domzad,
        (id_stud = studDz.stud_stud || studDz.id_stud),
        $scope.teachFile
      )
      .then(
        (res) => {
          // используем старый метод для сохранения оценки, в нем использовался объект объектов с оценками.
          let DzMarks = {};
          let date = new Date();
          let keyMark = "" + date.getSeconds() + date.getMilliseconds();
          DzMarks[keyMark] = {
            id: studDz.id_domzad,
            mark: studDz.mark,
            ospr: studDz.ospr,
            stud: studDz.id_stud,
          };
          studDz.marks = DzMarks;
          // если есть ссылка на файл от препода то передаем ее
          if (res && res[0].link) {
            studDz.comment_attach = res[0].link;
            // обнуление прикрепленного файла (для представления)
            studDz.file_attach = null;
            if ($scope.ActiveStudHw && $scope.ActiveStudHw.file_attach) {
              $scope.ActiveStudHw.file_attach = null;
            }
          }
          homeworkHttp
            .saveHomework({ HomeworkForm: studDz })
            .success(function (r) {
              if (r.error) {
                $mdToast.show({
                  hideDelay: 4000,
                  position: "top right",
                  template:
                    '<md-toast class="md-toast red">' + r.error + "</md-toast>",
                });
              } else {
                $scope.teachFile = null; //обнуление прикрепленного файла после удачного сохранения
                $scope.getHomeworks();
                $scope.getModalData();
                if ($scope.ActiveStudHwNewValue) {
                  $scope.ActiveStudHwNewValue.comment_attach_file =
                    r.responseComment.attach_name;
                }
                studDz.comment_attach_file = r.responseComment.attach_name;
                if (!isNewHw) {
                  $mdDialog.hide();
                }
                $mdToast.show({
                  hideDelay: 4000,
                  position: "top right",
                  template:
                    '<md-toast class="md-toast green">' +
                    r.success +
                    "</md-toast>",
                });
              }
            });
        },
        (err) => {
          console.error("err", err);
        }
      );
  };

  /**
   * получаем файл
   * @param file
   * @returns {null}
   */
  $scope.contentChanged = function (file) {
    if (!file.files.length) {
      return null;
    }
    $scope.teachFile = file.files[0];
  };
  /**
   * Т.к при перетаскивании файла не срабатывает onchange событие, присваиваем файл через эту функцию
   * @param file - файл передается из директивы fileDropzone
   */
  $scope.setTeachFile = function (file) {
    $scope.teachFile = file;
  };

  /**
   * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
   * @param str
   * @returns {*}
   */
  $scope.trustAsHtmlFuncTransform = function (str) {
    return $sce.trustAsHtml(str);
  };

  $scope.getModalData(null, true);
  $scope.getStartData();
}
