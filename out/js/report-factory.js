/**
 * Created by Артем on 23.09.16.
 */
var app_module = angular.module('app');

app_module.factory('reportHttp', ['$http', function($http){
    return {
        getStartData : function(data){
            return $http.post('/report/index', data);
        },
        getData : function(data){
            return $http.post('/report/get-report', data)
        },
        getReportGroup : function(data){
            return $http.post('/report/get-report-group', data)
        },
        getTeachGroups : function(data){
            return $http.post('/students/get-groups-list', data)
        }
    };
}]);