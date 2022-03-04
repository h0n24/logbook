var app_module = angular.module('app');

app_module.controller('certificatesCtrl', ['$scope', 'certificatesHttp', 'localStorageService', '$mdDialog', '$filter', 'baseHttp', certificatesCtrl]);

function certificatesCtrl($scope, certificatesHttp, localStorageService, $mdDialog, $filter, baseHttp){

    $scope.groups    = {};
    $scope.students  = {};
    $scope.cert_form = {};
    $scope.getGroups = function(){
        certificatesHttp.getGroups().success(function(r){
            if(angular.isDefined(r)) {
                $scope.groups = r;
            }
        });
    };

    $scope.file_hw_filename = $filter('translate')('select_file');

    $scope.fileName = function(e){
        $scope.file_hw_filename = e.target.files[0].name;
    };

    $scope.getStudents = function(group){
        certificatesHttp.getStudents({id_tgroups : group}).success(function(r){
            if(angular.isDefined(r)) {
                $scope.students = r;
            }
        });
    };

    $scope.addCertificate = function(obj){
        var data = new FormData();
        data.append('data', angular.toJson(obj));
        if(angular.isDefined(obj.file)){
            // На момент переезда на новый файловый раздел отключен.
            return;
        }
    };

    $scope.addCertificateBase = function(data){
        certificatesHttp.addCertificate(data).success(function(r){
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
                $scope.cert_form = {};
            }
        });
    };

    $scope.getHistoryLocal = function(data){
        function filterByID(obj) {
            if (!data.id_tgroups) {
                return true;
            } else if (obj.name_tgroups == data.id_tgroups) {
                return true;
            }
            return false;
        }
        $scope.history = $scope.historyFilter.filter(filterByID);
        $scope.sertificatesActive = 2;
    };

    $scope.getHistory = function(data){
        certificatesHttp.getHistory(data).success(function(r){
            if(angular.isDefined(r)) {
                $scope.history = r;
                $scope.historyFilter = r;
            }
        });
        $scope.sertificatesActive = 2;
    };

    $scope.getGroupHistory = function(){
        certificatesHttp.getGroupHistory().success(function(r){
            if(angular.isDefined(r)){
                $scope.group_history = r;
            }
        });
    };

    $scope.deleteCert = function(id){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('confirm_delete_certificate'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            certificatesHttp.deleteСert({id : id}).success(function(r){
                $scope.getHistory({id_tgroups : $scope.current_group_history});
            });
        });
    };

    $scope.getGroups();
}

