/**
 * Created by vovk on 09.11.2017.
 */

var app_module = angular.module('app');

app_module.factory('dossierHttp', ['$http', function($http){
    return {
        getSingleData : function(data){
            return $http.get('/dossier/get-single-data', data);
        },
        getDataGraphics : function(data){
            return $http.get('/dossier/get-data-graphics', data)
        },
        getAllData : function(data){
            return $http.get('/dossier/get-all-data', data);
        },
        getVideo: function (data) {
            return $http.post('/dossier/get-video-teach', data); //видео отчеты
        },
        getStatusNameVideo: function (data) {
            return $http.post('/dossier/get-video-status', data); //видео статусы
        }
    };
}]);