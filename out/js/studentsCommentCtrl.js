/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');

app_module.controller('studentsCommentCtrl', ['$scope', 'studentsHttp', '$mdDialog', '$filter', '$mdToast', '$rootScope', '$location', studentsCommentCtrl]);

function studentsCommentCtrl($scope, studentsHttp, $mdDialog, $filter, $mdToast, $rootScope, $location){
    /**
     * Список студентов
     * @type {Array}
     */
    $scope.students = [];
    $scope.comment = {};
    $scope.commentLength = 5; // минимальная длина комментария
    $scope.comment.group = angular.isDefined($scope.groups) ? $scope.groups[0].id_tgroups : '';
    $scope.setComments = function(data){
        studentsHttp.setComments(data).success(function(r){
            if(r.error) {
                angular.forEach(r.error, function (value, key) {
                 //   Materialize.toast(value, 4000, 'red');
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }else {
            //    Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.comment.comment = '';
                $scope.getComments($scope.active_stud, $scope.comment.spec);
            }
        })
    }

    $scope.getStudentsShort = function(group, index){
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_comment = r;
            $scope.changeStud($scope.students_comment[0].id_stud, false);
        });
        $scope.curStud = 0;
        $scope.curGroup = this.$index;
        if(angular.isDefined(index)){
            $scope.curGroup = index;
        }
    };

    //$scope.getStudentsShort($scope.comment.group);

    $scope.changeStud = function(stud, updateStud){
        $scope.comment.stud = stud;
        $scope.active_stud = stud;
        $scope.getComments(stud);
        if(updateStud) {
            $scope.curStud = this.$index;
        }
        $scope.getSpecs(stud);
    }

    $scope.getComments = function(stud, spec){
        studentsHttp.getComments({stud : stud, spec : spec}).success(function(r){
            $scope.student_comments = r;

        })
    }

    $scope.getSpecs = function(stud){
        studentsHttp.getSpecs({stud : stud}).success(function(r){
            if(angular.isDefined(r)){
                $scope.specs_list = r;
            }
        })
    }



    //$scope.deleteComment = function(comment){
    //    studentsHttp.deleteComment({id_comment : comment}).success(function(r){
    //        $scope.getComments($scope.active_stud);
    //    })
    //}

    $scope.showConfirmDeleteComment = function(id) {
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('confirm_delete_comment'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            studentsHttp.deleteComment({id_comment : id}).success(function(r){
                $scope.getComments($scope.active_stud, $scope.comment.spec);
            })
        });
    };

    /**
     * Модальное окно с комментариями отзывов
     * через $rootScope чтобы было видно в модалке с другим контроллером
     */
    $rootScope.showMyReviews = function() {
        if ($location.url() != '/students/comment') {
            return;
        }
        if($scope.notDoneTask.reviewsStud.students_list.length !== 0){
            $mdDialog.show({
                controller: baseCtrl,
                contentElement: '#myReviews',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        }

        /**
         * Все студенты которые учились у преподавателя данные для статистики
         */
        studentsHttp.getStudents({group: $scope.cur_group}).success(function (result) {
            for (var i = 0; i < result.length; i++) {
                $scope.students[result[i].id_stud] = result[i];
            }
        });
    }

    /**
     * Процент посещаемости по студенту
     * @param idStud
     * @returns {string}
     */
    $scope.getPercentStud = function(idStud)
    {
        if($scope.students[idStud]){
            return $scope.students[idStud].percent_vizit + ' %';
        }

        return '-';
    };

    /**
     * Средняя оценка по студенту
     * @param idStud
     * @returns {string|*}
     */
    $scope.getGpatStud = function(idStud)
    {
        if($scope.students[idStud]){
            return $scope.students[idStud].gpa;
        }

        return '-';
    };

    /**
     * Фото студента
     * @param idStud
     * @returns {string|*}
     */
    $scope.getPhotoStud = function(idStud)
    {
        if($scope.students[idStud]){
            return $scope.students[idStud].photo_pas;
        }

        return '/img/students/users.svg';
    };

    /**
     * Сохраняем отзывы о студентах
     */
    $scope.sendReviews = function () {
        var resultComments = document.getElementsByClassName("textarea-rev");
        var dataResultComments = []; // объявление массива
        var j = 0;
        let emptyCommentsCount = 0; // считаем кол-во пустых комментариев. Если все пустые - отображаем ошибку, при нажатии на Отправить
        for (var i = 0; i < resultComments.length; i++) {
            $scope.notDoneTask.reviewsStud.students_list[i].error = false;
            if (resultComments[i].value.trim().length === 0) {
                emptyCommentsCount += 1;
            }
            if (resultComments[i].value !== "" && resultComments[i].value !== undefined && resultComments[i].value.length >= $scope.commentLength) {
                dataResultComments[j] = {
                    student_id: resultComments[i].dataset.stud,
                    message: resultComments[i].value,
                    id_spec: resultComments[i].dataset.spec
                }
                j++;
            }
            // длинна комментария должна быть не меньше 5 символов
            if (resultComments[i].value.length > 0 && resultComments[i].value.trim().length < $scope.commentLength) {
                $scope.notDoneTask.reviewsStud.students_list[i].error = true;
            }
        }
        if (emptyCommentsCount === resultComments.length) {
            $mdToast.show({
                hideDelay   : 4000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">' + $filter('translate')('reviews_empty_comments_error') + '</md-toast>',
            });
            return;
        }
        // показываем ошибку, если есть хоть один комментарий, меньше 5 букв
        for (let i = 0; i < $scope.notDoneTask.reviewsStud.students_list.length; i++) {
            if ($scope.notDoneTask.reviewsStud.students_list[i].error === true) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + $filter('translate')('reviews_comment_error') + '</md-toast>',
                });
                return;
            }
        }

        /**
         * Вызывать только при сохранении комментариев Попап окно “Оставьте отзыв”
         */
        studentsHttp.setCommentList({data: dataResultComments}).success(function () {
            $mdDialog.hide();
            $scope.notDoneTaskInfo();
        })

    };

    /**
     * Запускаем модальное окно с отзывами
     */
    $rootScope.showMyReviews();

}