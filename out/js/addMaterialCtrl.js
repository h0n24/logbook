var app = angular.module('app');

app.controller('addMaterialCtrl', ['$scope', 'presentsHttp', 'localStorageService', '$rootScope', 'baseHttp', '$filter', '$mdToast', '$mdDialog', 'MATERIAL_TYPE', 'DIRECTORY_TYPE', addMaterialCtrl]);

function addMaterialCtrl($scope, presentsHttp, localStorageService, $rootScope, baseHttp, $filter, $mdToast, $mdDialog, MATERIAL_TYPE, DIRECTORY_TYPE){
    $scope.form = {};
    $scope.form.type = 1;
    $scope.form.type = 1;
    $scope.cur_group = localStorageService.get('cur_group_pr');
    $scope.cur_lenta = localStorageService.get('cur_lenta_pr');
    $scope.cur_schedule  = localStorageService.get('cur_schedule_pr');
    $scope.cur_date  = localStorageService.get('cur_date_pr');
    $scope.cur_spec  =  localStorageService.get('cur_spec_pr');
    $scope.form.theme  =  localStorageService.get('theme') ? localStorageService.get('theme') : "";
    $scope.MATERIAL_TYPE = MATERIAL_TYPE;

    $scope.file_hw_filename = $filter('translate')('select_file');

    $scope.fileName = function(e){
        $scope.file_hw_filename = e.target.files[0].name;
    };

    $scope.fileNameCover = function(e){
        $scope.file_cover = e.target.files[0].name;
    };

    if(!angular.isDefined($scope.cur_spec) || !$scope.cur_spec){
        $rootScope.redirect('presents');
    }else {
        $scope.getTypes = function () {
            presentsHttp.getMaterialsType({}).success(function (r) {
                $scope.types = r;
            });
        };
        $scope.addMaterials = function () {
            if ($scope.hasCover($scope.form.type) && !$scope.file_cover) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + $filter('translate')('cover_is_required') + '</md-toast>',
                });
                return;
            }
            if($scope.form.type === undefined){
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + $filter('translate')('select_material_type') + '</md-toast>',
                });
                return;
            }
            var data = new FormData();
            angular.forEach($scope.form, function (value, key) {
                if(key !== 'file' && key !== 'filename_book'){
                    data.append(key, value);
                }
            });
            data.append('id_tgroups', $scope.cur_group);
            data.append('id_spec', $scope.cur_spec.id_spec);
            data.append('date_vizit', $scope.cur_date);
            data.append('lenta', $scope.cur_lenta);
            data.append('schedule', $scope.cur_schedule);

            $scope.showLoadedMaterials = 1;
            if((
                angular.isDefined(angular.isDefined($scope.form.file)) || angular.isDefined($scope.form.filename_book)) &&
                ($scope.hasFile($scope.form.type) || $scope.hasCover($scope.form.type))
            ) {
                // Если есть какие-то файлы отправляем запрос на файловый сервер.
                baseHttp.getFileUploadToken().success(function(credentials) {
                    if (angular.isDefined(credentials.token)) {
                        var promiseFile = new Promise(function(resolve, reject){
                            if (angular.isDefined($scope.form.file) && $scope.hasFile($scope.form.type)) {
                                baseHttp.uploadFile(credentials, $scope.form.file, DIRECTORY_TYPE.MATERIAL).success(function (rU) {
                                    if (angular.isDefined(rU[0].link)) {
                                        resolve(rU[0].link);
                                    }else{
                                        reject($filter('translate')('cover_upload_error'));
                                    }
                                }).error(function (eR){
                                    // Если мы не смогли отправить файл на сервер выбрасываем ошибку приложения
                                    $mdToast.show({
                                        hideDelay : 4000,
                                        position : 'top right',
                                        template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_server_error_lb_hw') + '</md-toast>',
                                    });
                                });
                            }else{
                                resolve(null);
                            }
                        });
                        var promiseFileCover = new Promise(function(resolve, reject){
                            if (angular.isDefined($scope.form.filename_book) && $scope.hasCover($scope.form.type)) {
                                baseHttp.uploadFile(credentials, $scope.form.filename_book, DIRECTORY_TYPE.COVER_IMAGE).success(function (rU) {
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
                        Promise.all([promiseFile, promiseFileCover]).then(function(fileNames){
                            if(fileNames[0]){
                                data.append('filename', fileNames[0]);
                            }
                            if(fileNames[1]){
                                data.append('img_book', fileNames[1]);
                            }
                            $scope.addMaterialsBase(data);
                        }, function(reason){
                            $mdToast.show({
                                hideDelay   : 4000,
                                position    : 'top right',
                                template: '<md-toast class="md-toast red">' + reason + '</md-toast>',
                            });
                        });
                    }
                });
            }else{
                //если нет файлов то сразу сохраняем
                $scope.addMaterialsBase(data);
            }
        };

        $scope.getMaterials = function () {
            presentsHttp.getMaterials({
                group: $scope.cur_group,
                lenta: $scope.cur_lenta,
                schedule: $scope.cur_schedule,
                date_vizit: $scope.cur_date
            }).success(function (r) {
                $scope.materials_details = r;
            });
        };

        $scope.addMaterialsBase = function(data){
            presentsHttp.addMaterials(data).success(function (r) {
                if (r.error) {
                    angular.forEach(r.error, function (value, key) {
                        $mdToast.show({
                            hideDelay   : 4000,
                            position    : 'top right',
                            template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                        });
                    });
                } else {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                    });
                    $scope.form = {};
                    $scope.form.type = 1;
                    $scope.form.theme  =  localStorageService.get('theme');
                    $scope.getMaterials();
                    $scope.file_hw_filename = '';
                    $scope.file_cover = '';
                }
            });
        };

        $scope.deleteMaterials = function (id) {
            var confirm = $mdDialog.confirm({
                templateUrl: "views/templates/confirms.html"
            })
                .title($filter('translate')('delete_material'))
                .ok($filter('translate')('ok'))
                .cancel($filter('translate')('cancel'));

            $mdDialog.show(confirm).then(function() {
                presentsHttp.deleteMaterial({id: id}).success(function () {
                    $scope.getMaterials();
                });
            });
        };

        $scope.downloadMaterial = function (type, filename) {
            presentsHttp.downloadMaterial({type: type, filename: filename});
        };

        $scope.changeType = function(type){
            var typeToCompare = parseInt(type);
            if(MATERIAL_TYPE.QUIZ === typeToCompare && angular.isUndefined($scope.testList)){
                presentsHttp.getRecommendedTest().success(function(r){
                    if(angular.isDefined(r)){
                        $scope.testList = r;
                    }
                });
            }
        };

        /**
         * Имеет ли материал типа type список тестов
         *
         * @param type
         * @returns {boolean}
         */
        $scope.hasQuizList = function (type) {
            return parseInt(type) === MATERIAL_TYPE.QUIZ;
        };

        /**
         * Имеет ли материал типа type ссылку на ресурс
         *
         * @param type
         * @returns {boolean}
         */
        $scope.hasUrl = function (type) {
            var typeToCompare = parseInt(type);

            return typeToCompare === MATERIAL_TYPE.LESSON ||
                typeToCompare === MATERIAL_TYPE.BOOK ||
                typeToCompare === MATERIAL_TYPE.VIDEO ||
                typeToCompare === MATERIAL_TYPE.PRESENTATION ||
                typeToCompare === MATERIAL_TYPE.POSTS;
        };

        /**
         * Имеет ли материал типа type инпут с файлом
         *
         * @param type
         * @returns {boolean}
         */
        $scope.hasFile = function (type) {
            var typeToCompare = parseInt(type);

            return typeToCompare === MATERIAL_TYPE.HOMEWORK ||
                typeToCompare === MATERIAL_TYPE.LABWORK ||
                typeToCompare === MATERIAL_TYPE.LESSON;
        };

        /**
         * Имеет ли материал типа type обложку
         *
         * @param type
         * @returns {boolean}
         */
        $scope.hasCover = function (type) {
            var typeToCompare = parseInt(type);

            return typeToCompare === MATERIAL_TYPE.BOOK ||
                typeToCompare === MATERIAL_TYPE.LESSON ||
                typeToCompare === MATERIAL_TYPE.LABWORK ||
                typeToCompare === MATERIAL_TYPE.HOMEWORK ||
                typeToCompare === MATERIAL_TYPE.VIDEO;
        };

        $scope.getMaterials();
        $scope.getTypes();
    }
}