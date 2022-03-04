/**
 * Created by zharko on 30.11.2016.
 */
var app_module = angular.module('app');

app_module.factory('certificatesHttp', ['$http', function($http){
    return {
        getHistory : function(data){
            return $http.post('/certificate/get-history', data);
        },
        getGroups : function(data){
            return $http.post('/certificate/get-teach-groups', data);
        },
        getStudents : function(data){
            return $http.post('/certificate/get-students', data);
        },
        addCertificate : function(data){
            return $http({
                method  : 'POST',
                transformRequest: angular.identity,
                url     : '/certificate/add-certificate',
                data    : data,
                headers : {'Content-Type': undefined}
            })
        },
        getGroupHistory : function(data){
            return $http.post('/certificate/get-group-history', data);
        },
        deleteСert : function(data){
            return $http.post('/certificate/delete-cert', data)
        }
    };
}]);
