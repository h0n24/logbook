var app_module = angular.module('app');

app_module.controller('TraficCtrl', ['$scope', 'trafficHttp', '$location', '$mdDialog', '$filter', '$compile', '$sce', '$templateRequest', '$mdToast', '$element', 'baseHttp','UPLOAD_TYPE_ATTACH_COMMENT_DZ','$rootScope', TraficCtrl])
/**
 * Контроллер отвечающий за потенциальніе потери среди студентов
 * @param $scope
 * @param trafficHttp
 * @param $location
 * @param $mdDialog
 * @param $filter
 * @param $compile
 * @param $sce
 * @param $templateRequest
 * @param $mdToast
 * @param $element
 * @param baseHttp
 * @param UPLOAD_TYPE_ATTACH_COMMENT_DZ
 * @param $rootScope
 * @constructor
 */
function TraficCtrl ($scope, trafficHttp, $location, $mdDialog, $filter, $compile, $sce, $templateRequest, $mdToast, $element, baseHttp, UPLOAD_TYPE_ATTACH_COMMENT_DZ, $rootScope) {

    $scope.stud_list = [];
    $scope.stud_list_not_view = [];
    /**
     * Кол-во элементов в stud_list_not_view (дабы можно было на странице понять где список не
     * просмотренных студентов, а где список запросы для принудительного коммента.
     */
    $scope.count_stud_list_not_view = 0;
    $scope.userId = '';
    $scope.viewModal = true;

    /**
     * Вывод списка студентов
     */
    $scope.renderStudentsList = function(){

        trafficHttp.getUserId().success(function(r){
            $scope.userId = r.succees;
            $scope.getTrafficStudents();

        });
    };

    /**
     * Работа с модалкой
     * @param $scope
     * @param $mdDialog
     * @constructor
     */
    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    /**
     * Открытие модалки
     */
    $scope.showPrerenderedDialog = function(template) {
        $mdDialog.show({
            controller: DialogController,
            contentElement: template,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    /**
     * Закрытие окна со студентами
     */
    $scope.hidemyDialog = function () {
        $mdDialog.hide();
    };

    /**
     * Выборка студентов которые попадают в потенциальные потери
     */
    $scope.getTrafficStudents = function(){
        trafficHttp.getTrafficStudents({teachId : $scope.userId}).success(function(r){
            $scope.stud_list = r.succees;
            $scope.getNoViewStudents();
        });
    }

    /**
     * Выборка студентов которые ПП
     * ПП (за минусом принудительным запросов) + принудительные запросы
     */
    $scope.getNoViewStudents = function () {
        trafficHttp.getStudentsActiveRequestsComment({teachId: $scope.userId}).success(function (r) {
            $scope.stud_list_not_view = r.success;
            $scope.count_stud_list_not_view = $scope.stud_list_not_view.length;
            $scope.stud_list = $scope.stud_list.concat(r.success);

            trafficHttp.getNoViewStudents({teachId: $scope.userId}).success(function (r) {
               $scope.stud_list_not_view = $scope.stud_list_not_view.concat(r.success);

                if ($scope.stud_list_not_view.length && $scope.viewModal) {
                    $scope.showPrerenderedDialog('#trafficDialog');
                }
            });
        });
    };

    /**
     * Добавление комментариев учителем
     */
    $scope.addCommentsTeach = function () {
        let countSuccessQuery = 0; // Кол-во успешно-обработанных запросов.
        let countErrorsQuery = 0; // Кол-во обработанных запросов с ошибкой.

        let lastSuccessMsg = ''; // Текст последнего успешно-обработанного запроса.
        let lastErrorMsg = '';// Текст последнего обработанного запроса с ошибкой.

        let blocksCounter= 0; // Счетчик обработанных блоков с комментариями

        // Получаем список блоков-комментов по каждому студенту (у каждого блока имеется класс dialog_students_traffic)
        let commentBlocks = document.querySelectorAll('div.dialog_students_traffic');
        const totalBlocks = commentBlocks.length;

        // Открываем цикл в котором перебираем каждый блок
        commentBlocks.forEach(function (element) {
            // Находим нужные данные в каждом блоке
            let comment = element.getElementsByClassName('texarea_stud')[0].value;
            let idStud = element.getAttribute('data-id');
            let requestId = element.getAttribute('data-request-id');
            blocksCounter++;

            // Делаем запрос, только если коммент не пустой.
            if (comment.replace(/\s/g, "") !== "") {
                trafficHttp.addCommentTeach({
                    teachId: $scope.userId,
                    studId: idStud,
                    comment: comment,
                    requestId: requestId
                }).success(function (r) {
                    if (r.success) {
                        countSuccessQuery++;
                        lastSuccessMsg = r.success;
                    }

                    if (r.error) {
                        countErrorsQuery++;
                        lastErrorMsg = r.error;
                    }
                    if (blocksCounter === totalBlocks) {
                        $scope.viewModal = false;
                        $scope.renderStudentsList();
                    }
                });
            }
        });

        // Если при запросах были ошибки - выводим их.
        if (countErrorsQuery > 0) {
            $mdToast.show({
                hideDelay: 4000,
                position: 'top right',
                template: '<md-toast class="md-toast red">(' + countErrorsQuery + ') ' + lastErrorMsg + '</md-toast>'
            });
        } else if (countSuccessQuery > 0) {
            $mdToast.show({
                hideDelay: 4000,
                position: 'top right',
                template: '<md-toast class="md-toast green">' + lastSuccessMsg + '</md-toast>'
            });
        }
        $scope.hidemyDialog();
    };

    $scope.updStud = {};
    $scope.updComment = {};

    /**
     * Редактироование комментария
     */
    $scope.updateComment = function(id) {
        $scope.updStud = $scope.stud_list.find(item => item.id_stud === id);
        $scope.updComment = {
            teachId: $scope.userId,
            studId: id,
            comment: $scope.updStud.comment_teatch,
            requestId: null
        };
        $scope.showPrerenderedDialog('#commentDialog');
    };

    /**
     * Подтверждение редактирования комментария
     */
    $scope.confirmUpdateComment = function() {
        trafficHttp.addCommentTeach($scope.updComment).success(function (r) {
            if (r.success) {
                $scope.hidemyDialog();
                $scope.updComment = {};
                $scope.updStud = {};
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.viewModal = false;
                $scope.renderStudentsList();
            }
            if (r.error) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            }
        })
    };

    $scope.renderStudentsList();
};