var app = angular.module('app');

app.factory('signalHttp', ['$http', function($http){
    return {
        getImplementors : function(){
            return $http.post('/signal/request/get-implementors');
        },
        getProblems: function () {
            return $http.post('/signal/request/get-problems');
        },
        addTask: function(data){
            return $http.post('signal/request/create-task', data);
        },
        getSignals: function(data){
            return $http.post('signal/request/get-list', data);
        },
        editTask: function(data){
            return $http.post('signal/request/update-comment', data);
        },
        deleteTask: function(data){
            return $http.post('signal/request/delete', data);
        },
        approveTask: function(data) {
            return $http.post('/signal/request/approve', data);
        },
        toWorkTask: function(data) {
            return $http.post('/signal/request/to-work', data);
        },
        getCounters: function(data) {
            return $http.post('/signal/request/get-counters', data);
        },
        setCounters: function(data) {
            return $http.post('/signal/request/set-counters', data);
        },
        getComments: function(data) {
            return $http.post('/signal/request/get-comments', data);
        }
    };
}]);
