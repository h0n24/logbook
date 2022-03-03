/**
 * Created by vovk on 06.10.2016.
 */

var app_module = angular.module('app');

app_module.factory('homeworkHttp', ['$http', function($http){
    return {
        getGroupsSpec : function(data){
            return $http.post('/homework/get-group-spec', data);
        },
        getStudents : function(data){
            return $http.post('/homework/get-students', data);
        },
        getHomeworks : function(data){
            return $http.post('/homework/get-homeworks', data);
        },
        setMark : function(data){
            return $http.post('/homework/set-mark', data, {headers : {'show-loader': ''}});
        },
        deleteHomework : function(data){
            return $http.post('/homework/delete-stud-dz', data);
        },
        getNewHomework   : function(data){
            return $http.post('/homework/get-new-homeworks', data);
        },
        saveComment  : function(data){
            return $http.post('/homework/set-comment', data);
        },
        deleteTeachHomework : function(data){
            return $http.post('/homework/delete-teach-homework', data);
        },
        approveRequest : function(data){
            return $http.post('/homework/approve-request', data);
        },
        deleteAttachComment : function(data){
            return $http.post('/homework/delete-attach-comment', data);
        },
        saveHomework : function(data){
            return $http.post('/homework/save-homework', data);
        },
    };
}]);