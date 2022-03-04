
var app_module = angular.module('app');

app_module.factory('contentAuthorHttp', ['$http', function($http){
    return {
        getContentAuthorData : function(data){
            return $http.get('/content-author/get-form-info', data);
        },
        sendContent : function(data){
            return $http.post('/content-author/send-content', data);
        },
    };
}]);