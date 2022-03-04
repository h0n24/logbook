/**
 * Created by Артем on 22.09.16.
 */
var app = angular.module('app');

app.factory('homeHttp', ['$http', function($http){
    return {
        getNews : function(data){
            return $http.post('/news/get-news', data);
        },
        getHomeEvents : function(data){
            return $http.post('/home/get-home-events', data);
        },
        getHomeDz : function(data){
            return $http.post('/home/get-home-dz', data);
        }
    }
}])