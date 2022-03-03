/**
 * Created by vovk on 26.09.2016.
 */
var app_module = angular.module('app');
app_module.factory('classworkHttp', ['$http', function($http){
    return {
        getStartData : function(){
            return $http.post('/classwork/index')
        },
        getStudents  : function(data){
            return $http.post('/classwork/get-students', data)
        },
        getTableData : function(data){
            return $http.post('/classwork/get-details', data)
        },
        setMark : function(data){
            return $http.post('/classwork/set-mark', data)
        }
    };
}])
