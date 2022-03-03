var app_module = angular.module('app');
app_module.factory('individualHttp', ['$http', function($http){
    return {
        getInfoVoucher : function(data){
            return $http.post('/individual/get-info-voucher', data);
        },
        confirmTeachVoucher: function(data){
            return $http.post('/individual/confirm-teach-voucher', data);
        },
    };
}])