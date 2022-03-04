/**
 * Created by vovk on 13.01.2017.
 */
var app = angular.module('app');
app.controller('methodPackageLogsCtrl', ['$scope', 'logsHttp', 'bindHttp', methodPackageLogsCtrl]);

function methodPackageLogsCtrl($scope, logsHttp, bindHttp){

    $scope.$parent.logsActive = 'method_package';
    $scope.currentPage = 0;
    $scope.limit = 200;
    $scope.filter = {};

    $scope.getCity = function(){
        bindHttp.getCity().success(function(r){
            $scope.cityList = r;
        });
    };

    $scope.getPublicForm = function(){
        bindHttp.getPublicForm({link : 1}).success(function(r){
            $scope.forms = r;
        });
    };

    $scope.getPublicSpec = function(id_form){
        bindHttp.getPublicSpec({form : id_form}).success(function(r){
            $scope.specs = r;
        });
    };

    $scope.getMethodPackageLog = function(data){
        $scope.currentPage = 0;
        logsHttp.getMethodPackageLog(data).success(function(r){
            var arrP = [];
            for(var i = 1; i <= Math.ceil(r.total/$scope.limit); i++){
                arrP.push(i);
            }
            $scope.coutPage = arrP;
            if(r.logsList){
                $scope.logs = r.logsList;
            }
        });
    };

    $scope.handler = function(e){
        var data = new Object();
        data.offset = e.target.text - 1;
        data.limit = $scope.limit;
        data.data = $scope.filter;

        $scope.getMethodPackageLog(data);
        $scope.currentPage = data.offset;
    };

    $scope.getPublicSpec();
    $scope.getPublicForm();
    $scope.getCity();
    $scope.getMethodPackageLog();

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };
}