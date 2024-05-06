var app_module = angular.module('app');

app_module.controller('contentAuthorCtrl', ['$scope', 'profileHttp', '$filter', 'baseHttp', '$mdToast', 'SOCIAL_MASKS', 'bindHttp', 'contentAuthorHttp', contentAuthorCtrl]);

function contentAuthorCtrl($scope, profileHttp, $filter, baseHttp, $mdToast, SOCIAL_MASKS, bindHttp, contentAuthorHttp){

    /**
     * очистка формы автора контента
     */
    $scope.clearApprovalForm = function() {
        $scope.contentData.additional_phone = null;
        $scope.contentData.additional_email = null;
        $scope.contentData.specialization = null;
        $scope.contentData.material_author_content_type = null;
        $scope.contentData.subject = null;
        $scope.contentData.amount_hour = null;
    };

    $scope.onlyNumbers = function (e) {
        e.preventDefault();
        if (!isNaN(+e.key) && e.target.value.length < 12 && e.key !== ' '){
            e.target.value += e.key;
        }
    };

    /**
     * получение данных для формы автора контента
     */
    $scope.getContentAuthorData = function() {
        contentAuthorHttp.getContentAuthorData().success(function (r) {
            $scope.contentData = r;
            $scope.contentData.additional_phone = null;
            $scope.contentData.additional_email = null;
        })
    };

    /**
     * отправление формы автора контента
     */
    $scope.sendContent = function () {
        let data = {};
        $scope.contentData.current_form = $scope.current_form;
        $scope.contentData.current_direction = $scope.current_direction;
        $scope.contentData.specialization = $scope.specialization;
        data['ContentAuthorForm'] = $scope.contentData;
        contentAuthorHttp.sendContent(angular.toJson(data)).success(function (r) {
            if (r.error) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            } else if (r.success) {
                $scope.clearApprovalForm();
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
            }
        });
    };

    /**
     * Позволяет вводить только цифры.
     */
    $scope.onlyNumbersValid = function (e) {
        let element = e.target;
        // Не даем пользователю ввести что-либо кроме цифр.
        element.value = element.value.replace(/[\D]/g, '');
    };

    /**
     * Получить формы обучения
     */
    $scope.getPublicForm = function () {
        bindHttp.getPublicForm().success(function (r) {
            $scope.public_form = r;
        });
    };

    /**
     * Получить предметы с учетом выбранной формы
     * @param form
     */
    $scope.getPublicDirection = function (form) {
        if ($scope.oldCurrentFormValue && $scope.oldCurrentFormValue.length > 0 && ($scope.current_form && $scope.current_form.length > 0)) {
            if ($scope.oldCurrentFormValue.join() != $scope.current_form.join()) {
                $scope.current_direction = [];
                $scope.public_spec = [];
                $scope.specialization = [];
                $scope.current_form = form;
                bindHttp.getAllDirection({form: form}).success(function (r) {
                    if (r) {
                        $scope.public_direction = r;
                        if ($scope.public_direction.length > 0) {
                            // добавляем к имени направления имя формы, чтобы в селекте их можно было различать
                            $scope.public_direction.forEach( elem => {
                                $scope.public_form.forEach( formElem => {
                                    if (elem.id_form == formElem.id_form) {
                                        elem.translate_key = elem.translate_key + ' (' + formElem.translate_key + ')';
                                    }
                                })
                            })
                        }
                    }
                });
            }
        } else if ((!$scope.oldCurrentFormValue || $scope.oldCurrentFormValue.length === 0) && $scope.current_form) {
            $scope.current_direction = [];
            $scope.public_spec = [];
            $scope.specialization = [];
            $scope.current_form = form;
            bindHttp.getAllDirection({form: form}).success(function (r) {
                if (r) {
                    $scope.public_direction = r;
                    if ($scope.public_direction.length > 0) {
                        // добавляем к имени направления имя формы, чтобы в селекте их можно было различать
                        $scope.public_direction.forEach( elem => {
                            $scope.public_form.forEach( formElem => {
                                if (elem.id_form == formElem.id_form) {
                                    elem.translate_key = elem.translate_key + ' (' + formElem.translate_key + ')';
                                }
                            })
                        })
                    }
                }
            });
        }
    };

    /**
     * возвращает методпакеты с уникальными именами.
     * @param specs
     * @returns {Array}
     */
    $scope.filterSpec = function(specs) {
        let uniqueSpecs = [];
        specs.forEach(elem => {
            if (uniqueSpecs.every(item => elem.short_name_spec != item.short_name_spec)) {
                uniqueSpecs.push(elem);
            }
        });
        return uniqueSpecs;
    };

    /**
     * Получить специализации с учетом выбранной формы и предметов
     * @param form
     * @param direction
     */
    $scope.getPublicSpec = function (form, direction) {
        if ($scope.oldCurrentDirValue && $scope.oldCurrentDirValue.length > 0 && ($scope.current_direction && $scope.current_direction.length > 0)) {
            if ($scope.oldCurrentDirValue.join() != $scope.current_direction.join()) {
                $scope.public_spec = [];
                $scope.specialization = [];
                bindHttp.getPublicSpec({form: form, direction: direction}).success(function (r) {
                    $scope.public_spec = $scope.filterSpec(r);
                });
            }
        } else if ($scope.current_direction && $scope.current_direction.length > 0) {
            $scope.public_spec = [];
            $scope.specialization = [];
            bindHttp.getPublicSpec({form: form, direction: direction}).success(function (r) {
                $scope.public_spec = $scope.filterSpec(r);
            });
        }

    };

    $scope.getPublicForm();

    $scope.getContentAuthorData();
}