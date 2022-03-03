/**
 * Created by Артем on 22.09.16.
 */
var app = angular.module('app');

app.factory('newsHttp', ['$http', function($http){
    return {
        getNews : function(data){
            return $http.post('/news/get-news', data);
        },
        readNews : function(data){
            return $http.post('/news/read-news', data);
        },
        getEvents : function(data){
            return $http.post('/news/get-events', data)
        },
        readEvent : function(data){
            return $http.post('/news/read-event', data);
        }
    }
}])