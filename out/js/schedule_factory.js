/**
 * Created by vovk on 17.08.2016.
 */
var app_module = angular.module('app');

app_module.factory('scheduleHttp', ['$http', function($http){
    return {
        getScheduleData : function(data){
            return $http.post('/schedule/get-schedule', data);
        }
    };
}]);