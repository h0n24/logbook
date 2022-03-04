/**
 * Created by vovk on 13.01.2017.
 */
var app = angular.module('app');

app.factory('logsHttp', ['$http', function($http){
    return {
        getMaterialsLog : function(data){
            return $http.post('/logs/get-materials-log-list', data);
        },
        getMethodPackageLog : function(data){
            return $http.post('/logs/get-method-package-log', data);
        },
        getBindLog : function(data){
            return $http.post('/logs/get-bind-log', data);
        },
        getEvents : function(data){
            return $http.post('/logs/get-events', data);
        },
        showDetailsMaterialLog : function(data){
            return $http.post('/logs/get-details-materials', data);
        },
        getPublicSpecLog : function(data){
            return $http.post('/logs/get-public-spec-logs', data);
        },
        showDetailsSpecLog : function(data){
            return $http.post('/logs/get-details-spec', data);
        }
    };
}]);

