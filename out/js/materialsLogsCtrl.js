/**
 * Created by vovk on 13.01.2017.
 */

var app = angular.module('app');
app.controller('materialsLogsCtrl', ['$scope','logsHttp', 'bindHttp', '$mdDialog', materialsLogsCtrl]);

function materialsLogsCtrl($scope, logsHttp, bindHttp, $mdDialog){

    $scope.$parent.logsActive = 'materials';
    $scope.currentPage = 0;
    $scope.limit = 200;

    $scope.filter = {};
    $scope.getMaterialsLogs = function(data){
        $scope.currentPage = 0;
        logsHttp.getMaterialsLog(data).success(function(r){
            var arrP = [];
            for(var i = 1; i <= Math.ceil(r.total/$scope.limit); i++){
                arrP.push(i);
            }
            $scope.coutPage = arrP;
            if(r.logsList){
                $scope.public_materials_log = r.logsList;
            }
        });
    };

    $scope.getMaterialsType = function(){
        bindHttp.getMaterialsTypes().success(function(r){
            $scope.materials_type = r;
        });
    };

    $scope.getCity = function(){
        bindHttp.getCity().success(function(r){
            $scope.cityList = r;
        });
    };

    $scope.handler = function(e){
        var data = new Object();
        data.offset = e.target.text - 1;
        data.limit = $scope.limit;
        data.data = $scope.filter;
        $scope.getMaterialsLogs(data);
        $scope.currentPage = data.offset;
    };

    $scope.scrolledOldVal = '0';
    $scope.showDetailsMaterialLog = function(id){
        logsHttp.showDetailsMaterialLog({id : id}).success(function(r){
            $scope.detailsMaterialLog = r;
            $mdDialog.show({
                contentElement: '#details_material',
                clickOutsideToClose: true,
                onShowing: function () {
                    $scope.scrolledOldVal = document.querySelector('html').scrollTop;
                },
                onRemoving: function () {
                    document.querySelector('html').scrollTop = +$scope.scrolledOldVal;
                }
            });
        });
    };

    $scope.getMaterialsType();
    $scope.getMaterialsLogs();
    $scope.getCity();

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };
}
