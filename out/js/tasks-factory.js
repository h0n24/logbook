/**
 * Created by vovk on 18.10.2016.
 */
var app = angular.module('app');

app.factory('tasksHttp', ['$http', function($http){
    return {
        getAllTasks : function(data){
            return $http.post('/tasks/get-all-tasks', data);
        },
        editTask    : function(data){
            return $http.post('/tasks/edit-task', data);
        },
        addComment  : function(data){
            return $http.post('/tasks/add-comment', data);
        },
        getComments : function(data){
            return $http.post('/tasks/get-comments', data);
        },
        getRooms    : function(data){
            return $http.post('/tasks/get-rooms', data)
        },
        addTask     : function(data){
            return $http.post('/tasks/add-task', data);
        },
        setStatusTask : function(data){
            return $http.post('/tasks/set-status-task', data);
        },
        deleteTask   : function(data){
            return $http.post('/tasks/delete-task', data);
        }
    }
}]);
