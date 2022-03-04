var app = angular.module('app');

app.controller('addLabWorkCtrl', ['$scope','presentsHttp', 'localStorageService','$rootScope', 'baseHttp', '$filter', 'OVERDUE_DAYS', '$mdToast','$mdDialog', 'DIRECTORY_TYPE', addLabWorkCtrl]);

function addLabWorkCtrl($scope, presentsHttp, localStorageService, $rootScope, baseHttp, $filter, OVERDUE_DAYS, $mdToast, $mdDialog, DIRECTORY_TYPE){

    $scope.form = {recommended : null};
    $scope.cur_group = localStorageService.get('cur_group_pr');
    $scope.cur_lenta = localStorageService.get('cur_lenta_pr');
    $scope.cur_date = localStorageService.get('cur_date_pr');
    $scope.cur_spec = localStorageService.get('cur_spec_pr');
    $scope.theme = localStorageService.get('theme');
    $scope.form.deadline = 0;
    $scope.file_hw_filename = $filter('translate')('select_file');

    $scope.fileName = function(e){
        $scope.file_hw_filename = e.target.files[0].name;
    };

    $scope.myDate = new Date();

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth(),
        $scope.myDate.getDate()
    );

    $scope.maxDate = new Date(
        $scope.myDate.getFullYear(),
        ($scope.myDate.getMonth() + 1),
        ($scope.myDate.getDate() - 1)
    );

    $scope.datapicker = function(data){
        let deadline = data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate();
        let curDate = $scope.minDate.getFullYear() + '-' + ($scope.minDate.getMonth() + 1) + '-' + $scope.minDate.getDate();

        if (deadline == curDate) {
            let confirm = $mdDialog.confirm({
                templateUrl: "views/templates/confirms.html"
            });
            confirm.title($filter('translate')('are_you_sure_you_to_lab_today'))
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

    if(!angular.isDefined($scope.cur_spec) || !$scope.cur_spec){
        $rootScope.redirect('presents');
    }else {
        $scope.new_hw = function () {
            var data = new FormData();
            if(!$scope.form.hasOwnProperty('recommended') && !$scope.form.recommended &&
                !$scope.form.hasOwnProperty('file_hw') && !$scope.form.file_hw
            ){
                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                });
                return false;
            }
            data.append('descr', $scope.form.descr);
            data.append('lenta', $scope.cur_lenta);
            data.append('date', $scope.cur_date);
            data.append('group', $scope.cur_group);
            data.append('spec', $scope.cur_spec.id_spec);
            data.append('dz_theme', $scope.form.dz_theme);
            data.append('deadline', $scope.form.deadline);
            data.append('type', 1);
            let recommendedHw = new Promise(function(resolve, reject){
                resolve(null);
            });
            let recommendedHwUrl = null;
            if($scope.form.hasOwnProperty('recommended') && $scope.form.recommended !== null &&
                $scope.form.recommended.hasOwnProperty('download_url') &&
                $scope.form.recommended.download_url != null
            ){
                if($scope.form.recommended.download_url !== $scope.form.recommended.filename){
                    // Если добавление ДЗ происходит из рекомендованых материалов
                    recommendedHw = baseHttp.getLegacyFile($scope.form.recommended.download_url);
                }else{
                    recommendedHwUrl = $scope.form.recommended.filename;
                }
                data.append('recommended', angular.toJson($scope.form.recommended));
            }
            if(recommendedHwUrl !== null){
                data.append('filename', recommendedHwUrl);
                $scope.createHw(data);
            }else{
                baseHttp.getFileUploadToken().success(function(credentials) {
                    if (angular.isDefined(credentials.token)) {
                        recommendedHw.then(function (blobf) {
                            let fl = blobf === null ? $scope.form.file_hw : blobf;
                            let fn = blobf !== null ? $scope.form.recommended.filename : null;
                            baseHttp.uploadFile(credentials,  fl, DIRECTORY_TYPE.HOMEWORK, fn).success(function (rU) {
                                let hwf = (typeof rU[0].link === "string") ? rU[0].link : null;
                                if(hwf !== null){
                                    data.append('filename', hwf);
                                    $scope.createHw(data);
                                }else{
                                    $mdToast.show({
                                        hideDelay : 4000,
                                        position : 'top right',
                                        template: '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                                    });
                                }
                            }).error(function (eR){
                                // Если мы не смогли отправить файл на сервер выбрасываем ошибку приложения
                                $mdToast.show({
                                    hideDelay : 4000,
                                    position : 'top right',
                                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_server_error_lb_hw') + '</md-toast>',
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
            }
        };

        $scope.createHw = function(data){
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
                        hideDelay : 4000,
                        position : 'top right',
                        template: '<md-toast class="md-toast green">' + rH.success + '</md-toast>',
                    });
                    $scope.getHomework();
                    $scope.file_hw_filename = $scope.SELECT_FILE;
                    $scope.file_cover = $scope.SELECT_FILE;
                    $scope.file_name_cover = '';
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
                    $scope.labwork = {};
                    $scope.$parent.labwork = {};
                    $scope.form = {};
                    $scope.form.deadline = 0;
                    $scope.getRecommendedMaterials();
                    $scope.getHomework();
                });
            });
        }
        $scope.getRecommendedMaterials = function(){//T
            presentsHttp
                .getRecommendedMaterials({spec : $scope.cur_spec.id_spec, type : 3})
                .success(function(r){
                    $scope.form.recommended_select = r;
                });
        }

        $scope.getHomework = function () {
            presentsHttp.getHomework({
                group: $scope.cur_group,
                lenta: $scope.cur_lenta,
                date: $scope.cur_date,
                ospr: 1
            }).success(function (r) {
                $scope.labwork = r;
                $scope.$parent.labwork = r;
                if (r.deadline == 0){
                    var dayAdd = new Date(r.date),
                        dayEnd = new Date(dayAdd.setDate(dayAdd.getDate() + OVERDUE_DAYS));
                    $scope.labwork.deadline = dayEnd;
                }
            });
        }

        $scope.getRecommendedMaterials();
        $scope.getHomework();
    }

    function zeroPad(num) {
        var zero = 2 - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

}

