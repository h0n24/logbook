/**
 * Created by vovk on 01.06.2017.
 */

var app = angular.module('app');
app.controller('methodBindLogsCtrl', ['$scope','logsHttp', 'bindHttp', methodBindLogsCtrl]);

function methodBindLogsCtrl($scope, logsHttp, bindHttp){

    $scope.$parent.logsActive = 'bind';
    $scope.limit = 200;
    $scope.currentPage = 0;
    $scope.filter = {};

    $scope.getMaterialsLogs = function(data){
        logsHttp.getMaterialsLog(data).success(function(r){
            if(r){
                $scope.public_materials_log = r;
            }
        });
    };

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

    $scope.handler = function(e){
        var data = new Object();
        data.offset = e.target.text - 1;
        data.limit = $scope.limit;
        data.data = $scope.filter;
        $scope.getBindLog(data);
        $scope.currentPage = data.offset;
    };

    $scope.getBindLog = function(data){
        $scope.currentPage = 0;
        logsHttp.getBindLog(data).success(function(r){
            $scope.logs = r.logsList;
            var arrP = [];
            for(var i = 1; i <= Math.ceil(r.total/$scope.limit); i++){
                arrP.push(i);
            }
            $scope.coutPage = arrP;
        });
    };

    $scope.getEvents = function(){
        logsHttp.getEvents().success(function(r){
            $scope.events = r;
        });
    };

    $scope.getPublicSpec();
    $scope.getPublicForm();
    $scope.getCity();
    $scope.getBindLog();
    $scope.getEvents();

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };
}
