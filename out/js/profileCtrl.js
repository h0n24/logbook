/**
 * Created by vovk on 12.08.2016.
 */
var app = angular.module('app');

app.controller('profileCtrl', ['$scope', 'profileHttp', '$filter', 'baseHttp', '$mdToast', 'SOCIAL_MASKS', 'contentAuthorHttp', 'bindHttp', profileCtrl]);

function profileCtrl($scope, profileHttp, $filter, baseHttp, $mdToast, SOCIAL_MASKS, contentAuthorHttp, bindHttp){

    $scope.socialMasks = SOCIAL_MASKS;
    $scope.videoList = [];
    $scope.statusListVideo = [];
    $scope.teachInputFile = null; // прикрепленный файл от преподаватля
    $scope.descriptionErr = false; // отображение ошибки минимального ввода символов
    $scope.fileFormats = ["txt", "csv"];
    $scope.err = {}; // ошибки валидации формы

    /**
     * Рейтинг видео
     * @type {number}
     */
    $scope.RATING_GOOD  = 1; //хорошо
    $scope.RATING_SATISFACTORILY  = 2; //удовлетворительно
    $scope.RATING_TAKE_NOTE  = 3; //обратить внимание
    $scope.RATING_NOT_SATISFACTORILY  = 4; //не удовлетворительно

    $scope.MAX_FILES_SIZE_MB = 199; // максимальный размер файла в Мб
    $scope.MAX_FILES_SIZE_B = $scope.MAX_FILES_SIZE_MB*1024*1024; // максимальный размер файла в байтах

    $scope.getProfile = function(){
        profileHttp.getProfile().success(function(r){
            $scope.form = r.teach_info;
            $scope.form.birthdat_teach = new Date(r.teach_info.birthdat_teach);
            $scope.form.socialLink = r.social_link;
        });
    };

    $scope.file_name = $filter('translate')('select_file');
    $scope.fileName = function(e){
        return $scope.file_name = e.target.files[0].name;
    };

    $scope.isValidFileFormat = function(fileName) {
        if (fileName) {
            let indx = fileName.lastIndexOf(".");
            let currFileFormat = fileName.substr(++indx);
            if (currFileFormat) {
                return this.fileFormats.indexOf(currFileFormat.toLowerCase()) === -1;
            }
        }
    };

    $scope.onlyNumbers = function (e) {
        e.preventDefault();
        if (!isNaN(+e.key) && e.target.value.length < 12){
            e.target.value += e.key;
        }
    };

    $scope.saveProfile = function(){
        if(!$scope.validateField()) {
            return false;
        }
        var data = new FormData();
        data.append('form',  angular.toJson($scope.form));
        $scope.saveProfileBase(data);
    };

    $scope.validateField = function(){
        if ($scope.profile.homePhone.$invalid) {
            $mdToast.show({
                hideDelay   : 2000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">' + $filter('translate')('homephone') + ' ' + $filter('translate')('entered_incorrectly') + '</md-toast>'
            });
            return false;
        }
        if ($scope.profile.mobilePhone.$invalid) {
            $mdToast.show({
                hideDelay   : 2000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">' + $filter('translate')('mobilphone') + ' ' + $filter('translate')('entered_incorrectly') + '</md-toast>'
            });
            return false;
        }
        if ($scope.profile.innerPhone.$invalid) {
            $mdToast.show({
                hideDelay   : 2000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">' + $filter('translate')('corporate_phone') + ' ' + $filter('translate')('entered_incorrectly') + '</md-toast>'
            });
            return false;
        }
        if ($scope.profile.innerPhone.$invalid) {
            $mdToast.show({
                hideDelay   : 2000,
                position    : 'top right',
                template: '<md-toast class="md-toast red">' + $filter('translate')('corporate_phone') + ' ' + $filter('translate')('entered_incorrectly') + '</md-toast>'
            });
            return false;
        }

        return true;
    };

    $scope.saveProfileBase = function(data){
        profileHttp.saveProfile(data).success(function (r) {
            if (r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            }
            else if (r.success) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.getProfile();
            }
        });
    };

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

    /**
     * получение данных для формы автора контента
     */
    $scope.getContentAuthorData = function() {
        contentAuthorHttp.getContentAuthorData().success(function (r) {
            $scope.contentData = r;
        })
    };

    /**
     * отправление формы автора контента
     */
    $scope.sendContent = function () {
        let data = {};
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
     * Позволяет воодить только цифры.
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

    $scope.checkFileType = function () {};

    $scope.getProfile();
}