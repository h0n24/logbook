/**
 * Created by vovk on 18.11.2016.
 */
var app = angular.module('app');

app.factory('portfolioHttp', ['$http', function($http){
    return {
        getGroups : function(data){
            return $http.post('/portfolio/get-groups', data);
        },
        getSpec : function(data){
            return $http.post('/portfolio/get-spec', data);
        },
        addToPortfolio : function(data){
            return $http.post('/portfolio/add-to-portfolio', data);
        },
        getStuds : function(data){
            return $http.post('/portfolio/get-students', data);
        },
        getHistory : function(data){
            return $http.post('/portfolio/get-history', data);
        },
        getHomeworkList : function(data){
            return $http.post('/portfolio/get-homeworks', data);
        },
        getStudRequest : function(data){
            return $http.post('/portfolio/get-stud-request', data);
        },
        approveRequest : function(data){
            return $http.post('/portfolio/approve-request', data);
        },
        deleteWork : function(data){
            return $http.post('/portfolio/delete', data);
        },
        achieveInfo : function(data){
            return $http.get('/portfolio/achieve-info', data);
        }
    };
}]);