/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');

app_module.controller('studentsCommentCtrl', ['$scope', 'studentsHttp', '$mdDialog', '$filter', '$mdToast',
    '$rootScope', '$location', studentsCommentCtrl]);

function studentsCommentCtrl($scope, studentsHttp, $mdDialog, $filter, $mdToast, $rootScope, $location){
    /**
     * Список студентов
     * @type {Array}
     */
    $scope.students = [];
    $scope.comment = {};
    $scope.currentReviewsPage = 1; // начальное значение "страницы" в модальном окне отзывов (нужно для пагинации, которую используем для дозагрузки отзывов)
    $scope.activeReviewsCount = 20; // начальное кол-во записей в модальном окне отзывов по студенту
    $scope.commentLength = 5; // минимальная длина комментария
    $scope.comment.group = angular.isDefined($scope.groups) && $scope.groups !== false ? $scope.groups[0].id_tgroups : '';
    $scope.showMobileFilter = false; // открытие фильтра в мобильном разрешении
    $scope.overdueComments = 1; // флаг отображения просроченных комментариев в модалке
    $scope.allComments = 0; // флаг отображения всех комментариев в модалке
    $scope.newReviewsFirst = '-id'; // флаг сортировки отзывов модального окна - вначале новые
    $scope.oldReviewsFirst = 'id'; // флаг сортировки отзывов модального окна - вначале старые
    $scope.sortFlag = '-id'; // параметр сортировки отзывов модального окна для запроса
    $scope.maxReviewCommentLength = 500; // максимальная длина комментария
    $scope.minReviewCommentLength = 10; // минимальная длина комментария

    /**
     * модели для фильтра в модалке отзывов
     * @type {{studyForm: string, group: string}}
     */
    $scope.select = {
        studyForm: '',
        group: ''
    };

    $scope.setComments = function(data){
        studentsHttp.setComments(data).success(function(r){
            if(r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }else {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.comment.comment = '';
                $scope.getComments($scope.active_stud, $scope.comment.spec);
            }
        })
    };

    $scope.getStudentsShort = function(group, index){
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_comment = r;
            if(!!$scope.students_comment[0]) {
                $scope.changeStud($scope.students_comment[0].id_stud, false);
            }
        });
        $scope.curStud = 0;
        $scope.curGroup = this.$index;
        if(angular.isDefined(index)){
            $scope.curGroup = index;
        }
    };

    $scope.changeStud = function(stud, updateStud){
        $scope.comment.stud = stud;
        $scope.active_stud = stud;
        $scope.getComments(stud);
        if(updateStud) {
            $scope.curStud = this.$index;
        }
        $scope.getSpecs(stud);
    };

    $scope.getComments = function(stud, spec){
        studentsHttp.getComments({stud : stud, spec : spec}).success(function(r){
            $scope.student_comments = r;
        })
    };

    $scope.getSpecs = function(stud){
        studentsHttp.getSpecs({stud : stud}).success(function(r){
            if(angular.isDefined(r)){
                $scope.specs_list = r;
            }
        })
    };

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
     * is_late - 0 или 1. По умолчанию 0 - статус по отзыву, просрочен или нет
     * id_tgroups - id группы
     * base_study_form__id - id формы обучения
     * pageSizeLimit - по умолчанию 20 - количество объектов
     * page - номер страницы
     * sort - сортировка (-id  - вначале новые, id - вначале старые)
     */
    $scope.getCommentsList = function () {
        studentsHttp.getCommentsList(
            {
                is_late: $scope.is_late,
                id_tgroups: $scope.select.group,
                base_study_form__id: $scope.select.studyForm,
                page: $scope.currentReviewsPage,
                sort: $scope.sortFlag
            }).success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            } else {
                $scope.studReviewsList = r;
                $scope.getCommentsListForms();
            }
        })
    };

    /**
     * Получить просроченные отзывы для модального окна
     */
    $scope.getOverdueCommentsList = function() {
        $scope.currentReviewsPage = 1;
        if ($scope.is_late !== 1) {
            $scope.is_late = 1;
            $scope.currentReviewsPage = 1;
            $scope.getCommentsList();
        }
    };

    /**
     * Получить все комментарии, для модального окна
     */
    $scope.getAllCommentsList = function() {
        $scope.currentReviewsPage = 1;
        if ($scope.is_late !== 0) {
            $scope.is_late = 0;
            $scope.currentReviewsPage = 1;
            $scope.getCommentsList();
        }
    };

    /**
     * Изменение формы в фильтре модального окна с отзывами
     * @param formId
     */
    $scope.changeFormReviewsModal = function(formId) {
        $scope.currentReviewsPage = 1;
        $scope.select.group = '';
        $scope.review_groups = '';
        $scope.getCommentsListGroups(formId);
        $scope.getCommentsList();
    };

    /**
     * Изменение группы в фильтре модального окна с отзывами
     */
    $scope.changeGroupReviewsModal = function() {
        $scope.currentReviewsPage = 1;
        $scope.getCommentsList();
    };

    /**
     * Получить список групп по форме, в модальном окне с отзывами
     * @param formId
     */
    $scope.getCommentsListGroups = function (formId) {
        if (formId) {
            studentsHttp.getCommentsListGroups({base_study_form__id: formId}).success(function(r){
                if(r.error) {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                    });
                } else {
                    $scope.review_groups = r.groups;
                }
            })
        }
    };

    /**
     * Сортировка в модальном окне отзыовов
     * @param sortFlag -id (с минусом) - вначале новые, id - вначале старые
     */
    $scope.sortReviewsModal = function(sortFlag) {
        $scope.sortFlag = sortFlag;
        $scope.currentReviewsPage = 1;
        $scope.getCommentsList();
    };

    /**
     * Получить список форм для фильтра модального окна
     */
    $scope.getCommentsListForms = function() {
        studentsHttp.getCommentsListForms().success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            } else {
                $scope.study_forms = r.study_forms;
            }
        })
    };

    /**
     * Загрузить еще отзывы
     */
    $scope.loadMoreReviews = function() {
        $scope.currentReviewsPage += 1;
        studentsHttp.getCommentsList(
            {
                is_late: $scope.is_late,
                id_tgroups: $scope.select.group,
                base_study_form__id: $scope.select.studyForm,
                page: $scope.currentReviewsPage,
                sort: $scope.sortFlag
            }).success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            } else {
                if (r.data.length !== 0) {
                    $scope.studReviewsList.data = [...$scope.studReviewsList.data, ...r.data];
                    $scope.getCommentsListForms();
                }
            }
        })
    };

    /**
     * Модальное окно с комментариями отзывов
     * через $rootScope чтобы было видно в модалке с другим контроллером
     */
    $rootScope.showMyReviews = function() {
        if ($location.url() !== '/students/comment') {
            return;
        }

        studentsHttp.getCommentsList().success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            } else {
                if (r.data.length !== 0) {
                    $scope.studReviewsList = r;
                    $scope.is_late = $scope.allComments;
                    $scope.getCommentsListForms();
                    $mdDialog.show({
                        controller: studentsCommentCtrl,
                        contentElement: '#myReviews',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true
                    });
                }
            }
        });

        /**
         * Все студенты которые учились у преподавателя данные для статистики
         */
        studentsHttp.getStudents({group: $scope.cur_group}).success(function (result) {
            for (var i = 0; i < result.length; i++) {
                $scope.students[result[i].id_stud] = result[i];
            }
        });
    };

    /**
     * Сохранение комментария в модальном окне
     * @param review
     */
    $scope.saveComment = function(review) {
        if (!review.comment || review.comment.length < $scope.minReviewCommentLength || review.isInSave) {
           return
        }
        review.isInSave = true;
        let data = {
            id: review.id,
            comment: review.comment,
            id_stud: review.student_id,
            id_teach: review.teacher_id,
            id_spec: review.id_spec,
            base_study_form__id: review.base_study_form__id,
            id_tgroups: review.id_tgroups,
        };

        studentsHttp.saveComment(data).success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
                review.isInSave = false;
            } else {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + $filter('translate')('reviews_send_success') +  '</md-toast>',
                });
                $scope.hideSuccessfulReview(review);
                review.isInSave = false;

            }
        }).error(function (){
            $mdToast.show({
                hideDelay   : 4000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">'+'Unknown error'+'</md-toast>',
            });
            review.isInSave = false;
        });
    };

    /**
     * Убираем отзыв из модального окна на фронте(без отправки тяжелого запроса на обновление данных в модалке)
     * @param review
     */
    $scope.hideSuccessfulReview = function(review) {
        // если это последний отзыв - закрываем модалку
        // if ($scope.studReviewsList.data.length === 1 && $scope.studReviewsList._meta.totalCount === 1) {
        if ($scope.studReviewsList._meta.totalAllCount === 1) {
            $scope.hideReviewsModal();
        } else {
            // если это последний отображенный отзыв, но есть еще - догружаем
            if ($scope.studReviewsList.data.length === 1 && $scope.studReviewsList._meta.totalCount > 1) {
                $scope.loadMoreReviews();
                // если это последний отзыв во вкладке Просроченные,
                // но остались отзывы во вкладке Все - переходим на вкладку Все
            } else if ($scope.studReviewsList._meta.totalAllCount > 1
                && $scope.is_late === $scope.overdueComments
                && $scope.studReviewsList._meta.totalOverdueCount === 1) {
                $scope.getAllCommentsList();
                return
            }

            // уменьшаем каунтер во вкладках
            $scope.changeCountersInModal(review.is_late);

            // удаляем отзыв на фронте, чтобы не отсылать запрос
            $scope.studReviewsList.data.some( (item, key) => {
                if (item.student_id === review.student_id &&  item.date_create_request === review.date_create_request) {
                    $scope.studReviewsList.data.splice(key, 1);
                    $scope.studReviewsList._meta.totalCount = $scope.studReviewsList._meta.totalCount - 1;
                }
            })
        }
    };

    /**
     * Изменение счетчика отзывов во вкладках модалки
     * @param isLate
     */
    $scope.changeCountersInModal = function(isLate) {
        if (isLate === $scope.overdueComments) {
            $scope.studReviewsList._meta.totalOverdueCount = $scope.studReviewsList._meta.totalOverdueCount - 1;
            $scope.studReviewsList._meta.totalAllCount = $scope.studReviewsList._meta.totalAllCount - 1;
        } else {
            $scope.studReviewsList._meta.totalAllCount = $scope.studReviewsList._meta.totalAllCount - 1;
        }
    };

    /**
     * Не даем ввести символов больше ограничения
     * @param comment
     * @returns {*}
     */
    $scope.validateReviewCommentLength = function(comment){
        if(comment){
            comment = comment.length > $scope.maxReviewCommentLength ? comment.slice(0,$scope.maxReviewCommentLength) : comment;
        }
        return comment;
    };

    /**
     * Процент посещаемости по студенту
     * @param idStud
     * @returns {string}
     */
    $scope.getPercentStud = function(idStud)
    {
        if($scope.students[idStud]){
            return $scope.students[idStud].percent_vizit;
        }

        return '0';
    };

    /**
     * Средняя оценка по студенту
     * @param idStud
     * @returns {string|*}
     */
    $scope.getGpaStud = function(idStud)
    {
        if($scope.students[idStud]){
            return $scope.students[idStud].gpa;
        }

        return '0';
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
     * Фото студента для модального окна
     * @param review
     * @returns {string|string}
     */
    $scope.getStudPhoto = function(review) {
        if(review.photo_pas){
            return review.photo_pas;
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
                };
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
     * Закрыть модальное окно
     */
    $scope.hideReviewsModal = function() {
        $mdDialog.hide();
    };

    /**
     * Запускаем модальное окно с отзывами
     */
    $rootScope.showMyReviews();
}