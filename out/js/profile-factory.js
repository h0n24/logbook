/**
 * Created by Артем on 23.09.16.
 */
var app = angular.module('app');

app.factory('profileHttp', ['$http', function($http){
    return {
        getProfile : function(data){
            return $http.post('/profile/get-profile', data);
        },
        saveProfile : function(data){
            return $http(
                {
                    method  : 'POST',
                    transformRequest: angular.identity,
                    url     : '/profile/save-profile',
                    data    : data,
                    headers : {'Content-Type': undefined}
                }
            )
        },
        sentAuthorMethodContent : function (data) {
            return $http(
                {
                    method  : 'POST',
                    transformRequest: angular.identity,
                    url     : '/profile/sent-author-method-content',
                    data    : data,
                    headers : {'Content-Type': undefined}
                }
            )
        }
        // changePassword : function(data){
        //     return $http.post('/profile/change-password', data);
        // }
    }
}])