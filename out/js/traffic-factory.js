
var app_module = angular.module('app');
app_module.factory('trafficHttp', ['$http', function($http){
    return {
        getTrafficStudents : function(data){
            return $http.post('/traffic/get-traffic-students', data);
        },
        getUserId : function(){
            return $http.post('/traffic/get-user-id');
        },
        getNoViewStudents : function(data){
            return $http.post('/traffic/get-no-view-students', data);
        },
        addCommentTeach : function(data){
            return $http.post('/traffic/add-comment-teach', data);
        },
        /**
         * Получение студентов по которым есть активный запрос написать коммент преподавателю.
         *
         * @param data - POST параметры.
         *
         * @return {HttpPromise}
         */
        getStudentsActiveRequestsComment: function (data) {
            return $http.post('/traffic/get-students-active-requests-comment', data);
        }
    };
}])
