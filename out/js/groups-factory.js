/**
 * Created by vovk on 17.10.2016.
 */
var app_module = angular.module('app');
app_module.factory('groupsHttp', ['$http', function($http){
    return {
        getStartData : function(){
            return $http.post('/classwork/index')
        },
        getStudents  : function(data){
            return $http.post('/groups/get-students', data)
        },
        getTableData : function(data){
            return $http.post('/groups/get-table', data)
        },
        setMark : function(data){
            return $http.post('/classwork/set-mark', data)
        }
    };
}])
