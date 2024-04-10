var app = angular.module('app');
app.controller('addHomeWorkCtrl', ['$scope','presentsHttp', 'localStorageService', '$rootScope', '$filter', 'baseHttp', 'OVERDUE_DAYS', '$mdToast', '$mdDialog', 'DIRECTORY_TYPE', addHomeWorkCtrl])

const ALLOWED_COVER_TYPES = ["image/jpeg", "image/png"];

function addHomeWorkCtrl($scope, presentsHttp, localStorageService, $rootScope, $filter, baseHttp, OVERDUE_DAYS, $mdToast, $mdDialog, DIRECTORY_TYPE){
    $scope.form = {};
    $scope.cur_group     = localStorageService.get('cur_group_pr');
    $scope.cur_lenta     = localStorageService.get('cur_lenta_pr');
    $scope.cur_schedule  = localStorageService.get('cur_schedule_pr');
    $scope.cur_date      = localStorageService.get('cur_date_pr');
    $scope.cur_spec      = localStorageService.get('cur_spec_pr');
    $scope.theme         = localStorageService.get('theme');
    $scope.form.deadline = 0;
    $scope.SELECT_FILE = $filter('translate')('select_file_dz');
    $scope.file_hw_filename = $scope.SELECT_FILE;
    $scope.file_cover = $scope.SELECT_FILE;

    $scope.autotestValues = {
        is_autotest: 0,// по умолчанию автотесты не выбраны
        unit_language: null,
        unit_type: null,
        unit_test: null,
        select_unit_version: null,
    };

    // данные для селектов
    $scope.autotestLists = {
        unitLanguages: null,
        unitTypes: null,
        unitVersions: null,
    };

    $scope.fileName = function(e){
        $scope.file_hw_filename = e.target.files[0].name;
    };

    $scope.myDate = new Date();

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth(),
        $scope.myDate.getDate());

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth() + 1,
        $scope.myDate.getDate() - 1);

    $scope.datapicker = function(data){
        let deadline = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
        let curDate = $scope.minDate.getFullYear() + '-' + ($scope.minDate.getMonth() + 1) + '-' + $scope.minDate.getDate();

        if (deadline == curDate) {
            let confirm = $mdDialog.confirm({
                templateUrl: "views/templates/confirms.html"
            });
            confirm.title($filter('translate')('are_you_sure_you_to_dz_today'))
                .ok($filter('translate')('ok'))
                .cancel($filter('translate')('cancel'));

            $mdDialog.show(confirm).then(function() {
                if (confirm) {
                    $scope.form.deadline = deadline;
                }
            });
        }else {
            $scope.form.deadline = deadline;
        }
    };

    $scope.fileNameCover = function(e){
        $scope.file_cover = e.target.files[0].name;
    };

    if($scope.disabledForm || !angular.isDefined($scope.cur_spec) || !$scope.cur_spec){
        $rootScope.redirect('presents');
    }else {
        $scope.new_hw = function () {
            let data = new FormData();
            let recommendedHw = new Promise(function(resolve, reject){
                resolve(null);
            });
            let recommendedHwImg = new Promise(function(resolve, reject){
                resolve(null);
            });
            let recommendedHwUrl = null;
                if(angular.isDefined($scope.form.recommended) && $scope.form.recommended){
                    // Если добавление ДЗ происходит из рекомендованых материалов и если нет html
                    if (!(angular.isDefined($scope.form.recommended.html) && $scope.form.recommended.html != null)) {
                        if($scope.form.recommended.download_url !== $scope.form.recommended.filename){
                            recommendedHw = baseHttp.getLegacyFile($scope.form.recommended.download_url);
                        }else{
                            recommendedHwUrl = $scope.form.recommended.filename;
                        }
                    }
                }else if(!(angular.isDefined($scope.form.file_hw) && $scope.form.file_hw)){
                    // Если преподаватель сам не добавил файл и не выбрал из рекомендованных
                    $mdToast.show({
                        hideDelay : 4000,
                        position : 'top right',
                        template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                    });
                    return false;
                }

            // добавление дефолтной обложки если препод сам грузит ДЗ
            if (!(angular.isDefined($scope.form.recommended) && $scope.form.recommended) && !$scope.form.filename_cover) {
                if(angular.isDefined($scope.form.recommended_select)){
                    if($scope.form.recommended_select.length > 0){
                        angular.forEach($scope.form.recommended_select, function(value, key) {
                            if(value.cover_img != null){
                                recommendedHwImg = baseHttp.getLegacyFile(value.cover_img);
                                data.append('recommended_cover_material_id', $scope.form.recommended_select.shift().id);
                            }
                        });
                    }
                }
            }
            //проверка типа файла
            if ($scope.form.filename_cover && !ALLOWED_COVER_TYPES.includes($scope.form.filename_cover.type)) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + $filter('translate')('invalid_file_cover') + '</md-toast>',
                });
                return false;
            }
            data.append('descr', $scope.form.descr);
            data.append('lenta[l_start]', $scope.cur_lenta.l_start);
            data.append('lenta[l_end]', $scope.cur_lenta.l_end);
            data.append('date', $scope.cur_date);
            data.append('group', $scope.cur_group);
            data.append('spec', $scope.cur_spec.id_spec);
            data.append('dz_theme', $scope.form.dz_theme);
            data.append('deadline', $scope.form.deadline);
            data.append('cur_schedule', $scope.cur_schedule);
            if (!$scope.autotestValues.recommended) {
                data.append('is_autotest', $scope.autotestValues.is_autotest);
                if ($scope.autotestValues.is_autotest == 1) {
                    data.append('unit_language', $scope.autotestValues.unit_language);
                    data.append('unit_type', $scope.autotestValues.unit_type);
                    data.append('unit_test', $scope.autotestValues.unit_test);
                    // раскомментировать когда понадобится версия
                    // data.append('unit_version', $scope.autotestValues.unit_version);
                }
            }
            data.append('type', 0);
            if(angular.isDefined($scope.form.recommended) && $scope.form.recommended != null){
                data.append('recommended', angular.toJson($scope.form.recommended.filename));
                data.append('recommended_material', $scope.form.recommended.id);
            }
            baseHttp.getFileUploadToken().success(function(credentials){
                if(angular.isDefined(credentials.token)) {
                    Promise.all([recommendedHw, recommendedHwImg]).then(function(values){
                        let blob1 = values[0];
                        let blob2 = values[1];
                        /**
                         * функция для загрузки файла ДЗ
                         */
                        let promiseFile;
                        // если есть html то не грузим файл на сервер (html может быть только в рекомендованых)
                        if (!(angular.isDefined($scope.form.recommended) && $scope.form.recommended.html != null)) {
                            if(blob1 !== null){
                                promiseFile = new Promise(function(resolve, reject){
                                    baseHttp.uploadFile(credentials, blob1, DIRECTORY_TYPE.HOMEWORK,  $scope.form.recommended.filename).success(function (rU) {
                                        if (angular.isDefined(rU[0].link)) {
                                            resolve(rU[0].link);
                                        }else{
                                            reject($filter('translate')('file_upload_error'));
                                        }
                                    });
                                });
                            }else if(recommendedHwUrl !== null){
                                promiseFile = new Promise(function(resolve, reject){
                                    resolve(recommendedHwUrl);
                                });
                            }else{
                                promiseFile = new Promise(function(resolve, reject){
                                    baseHttp.uploadFile(credentials, $scope.form.file_hw, DIRECTORY_TYPE.HOMEWORK).success(function (rU) {
                                        if (angular.isDefined(rU[0].link)) {
                                            resolve(rU[0].link);
                                        }else{
                                            reject($filter('translate')('file_upload_error'));
                                        }
                                    }).error(function (eR){
                                        // Если мы не смогли отпарвить файл на сервер выбрасываем ошибку приложения
                                        $mdToast.show({
                                            hideDelay : 4000,
                                            position : 'top right',
                                            template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_server_error_lb_hw') + '</md-toast>',
                                        });
                                    });
                                });
                            }
                        } else {
                            promiseFile = new Promise(function(resolve, reject){
                                resolve(null);
                            });
                        }

                        /**
                         * Функция для загрузки обложки ДЗ
                         */
                        let promiseFileCover;
                        if(blob2 !== null){
                            promiseFileCover = new Promise(function(resolve, reject){
                                if (angular.isDefined($scope.form.filename_cover) && (!angular.isDefined($scope.form.recommended) && !$scope.form.recommended)) {
                                    baseHttp.uploadFile(credentials, blob2, DIRECTORY_TYPE.COVER_IMAGE,  $scope.form.recommended.img_book).success(function (rU) {
                                        if (angular.isDefined(rU[0].link)) {
                                            resolve(rU[0].link);
                                        }else{
                                            reject($filter('translate')('cover_upload_error'));
                                        }
                                    });
                                }else{
                                    resolve(null);
                                }
                            });
                        }else{
                            promiseFileCover = new Promise(function(resolve, reject){
                                if (angular.isDefined($scope.form.filename_cover) && (!angular.isDefined($scope.form.recommended) && !$scope.form.recommended)) {
                                    baseHttp.uploadFile(credentials, $scope.form.filename_cover, DIRECTORY_TYPE.COVER_IMAGE).success(function (rU) {
                                        if (angular.isDefined(rU[0].link)) {
                                            resolve(rU[0].link);
                                        }else{
                                            reject($filter('translate')('cover_upload_error'));
                                        }
                                    });
                                }else{
                                    resolve(null);
                                }
                            });
                        }
                        /**
                         * Загрузка файлов/обложки ДЗ, после этого отправляется запрос на создание ДЗ на сервер приложения
                         */
                        Promise.all([promiseFile, promiseFileCover]).then(function(value){
                            let hwf = (typeof value[0] === "string") ? value[0] : null;
                            let hwfC = (typeof value[1] === "string") ? value[1] : null;
                            if(hwf !== null){
                                data.append('filename', hwf);
                            }
                            if(hwf == null && $scope.form.recommended.download_url) {
                                data.append('filename', $scope.form.recommended.download_url);
                            }
                            if(hwfC !== null){
                                data.append('img_cover', hwfC);
                            }
                            presentsHttp.newHomework(data).success(function (rH) {
                                if (rH.error) {
                                    $mdToast.show({
                                        hideDelay : 4000,
                                        position : 'top right',
                                        template : '<md-toast class="md-toast red">' + rH.error + '</md-toast>',
                                    });
                                }
                                else if (rH.success) {
                                    $scope.form = {};
                                    $scope.form.deadline = 0;
                                    $scope.getRecommendedMaterials();
                                    $mdToast.show({
                                        hideDelay   : 4000,
                                        position    : 'top right',
                                        template: '<md-toast class="md-toast green">' + rH.success + '</md-toast>',
                                    });
                                    $scope.getHomework();
                                    $scope.file_hw_filename = $scope.SELECT_FILE;
                                    $scope.file_cover = $scope.SELECT_FILE;
                                    $scope.file_name_cover = '';
                                }
                            });
                        }, function(reason){
                            $mdToast.show({
                                hideDelay : 4000,
                                position : 'top right',
                                template : '<md-toast class="md-toast red">' + reason + '</md-toast>',
                            });
                        });
                    }, function () {
                        $mdToast.show({
                            hideDelay : 4000,
                            position : 'top right',
                            template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                        });
                    });
                }
            });
        };

        $scope.getHomework = function () {
            presentsHttp.getHomework({
                group: $scope.cur_group,
                lenta: $scope.cur_lenta,
                date: $scope.cur_date,
                cur_schedule: $scope.cur_schedule,
                ospr: 0
            }).success(function (r) {
                $scope.homework = r;
                $scope.$parent.homework = r;
                if (r?.deadline === 0){
                    var dayAdd = new Date(r.time),
                        dayEnd = new Date(dayAdd.setDate(dayAdd.getDate() + OVERDUE_DAYS));
                    $scope.homework.deadline = dayEnd;
                }
            });
        };

        $scope.deleteHW = function (id) {
            var confirm = $mdDialog.confirm({
                templateUrl: "views/templates/confirms.html"
            })
                .title($filter('translate')('delete_material'))
                .ok($filter('translate')('ok'))
                .cancel($filter('translate')('cancel'));

            $mdDialog.show(confirm).then(function() {
                presentsHttp.deleteHomework({id: id}).success(function (r) {
                    $scope.homework = {};
                    $scope.$parent.homework = {};
                    $scope.form = {};
                    $scope.form.deadline = 0;
                    $scope.getRecommendedMaterials();
                    $scope.getHomework();
                });
            });
        };

        $scope.getRecommendedMaterials = function(){
            presentsHttp
                .getRecommendedMaterials({spec : $scope.cur_spec.id_spec, type : 1})
                .success(function(r){
                    $scope.form.recommended_select = r;
                });
        };

        // получить типы для автотестов
        $scope.getUnitTypes = function () {
            presentsHttp.getUnitTypes().success(function (r) {
                $scope.autotestLists.unitTypes = r;
            });
        };

        // получить языки для автотестов
        $scope.getUnitLanguages = function () {
            presentsHttp.getUnitLanguages().success(function (r) {
                $scope.autotestLists.unitLanguages = r;
            });
        };

        // раскомментировать когда понадобится
        // получить версии для автотестов
        // $scope.getUnitVersions = function () {
        //     presentsHttp.getUnitVersions().success(function (r) {
        //         $scope.autotestLists.getUnitVersions = r;
        //     });
        // };

        $scope.getRecommendedMaterials();
        $scope.getHomework();
        $scope.getUnitTypes();
        $scope.getUnitLanguages();

        // раскомментировать когда понадобится
        // $scope.getUnitVersions();
    }

    function zeroPad(num) {
        var zero = 2 - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }
}

