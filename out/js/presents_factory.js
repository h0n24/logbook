/**
 * Created by vovk on 18.08.2016.
 */
var app_module = angular.module('app');

app_module.factory('presentsHttp', ['$http', '$rootScope', function($http, $rootScope){
    return {
        getPresents : function(data, headers){
            return $http.post('/presents/get-presents', data, {headers : headers});
        },
        setTheme     : function(data){
            return $http.post('/presents/set-theme', data)
        },
        setWas       : function(data){
            return  $http({
                method  : 'POST',
                url     : '/presents/set-was',
                data    : data,
                headers : {'show-loader': ''}
            })
        },
        setMark      : function(data){
            return $http.post('/presents/set-mark', data, {headers : {'show-loader': ''}})
        },
        copyFromPrev : function(data){
            return $http.post('/presents/copy-from-prev', data, {headers : {'show-loader': ''}})
        },
        newHomework  : function(data){
            return  $http({
                method  : 'POST',
                transformRequest: angular.identity,
                url     : '/presents/new-homework',
                data    : data,
                headers : {'Content-Type': undefined}
            })
        },
        // uploadHomework : function(data){
        //     data.append('env', $rootScope.env);
        //     return  $http({
        //         method  : 'POST',
        //         transformRequest: angular.identity,
        //         url     : $rootScope.upload_url,
        //         data    : data,
        //         headers : {'Content-Type': undefined}
        //     })
        // },
        getMaterialsType : function(data){
            return $http.post('/presents/get-materials-type', data);
        },
        addMaterials : function(data){
            return $http({
                    url : '/presents/add-materials',
                    data : data,
                    headers : {'Content-Type': undefined},
                    transformRequest: angular.identity,
                    method  : 'POST'
                }
            );
        },
        deleteHomework : function(data){
            return $http.post('/presents/delete-homework', data)
        },
        getMaterials : function(data){
            return $http.post('/presents/get-materials', data)
        },
        deleteMaterial : function(data){
            return $http.post('/presents/delete-material', data)
        },
        getRecommendedMaterials : function(data){
          return $http.post('/presents/get-recommended-homework', data);
        },
        getHomework : function(data){
            return $http.post('/presents/get-homework', data)
        },
        downloadMaterial : function(data){
            return $http.post('/homework/download-file', data)
        },
        GetDataRequestZavuch : function(){
            return $http.post('/presents/get-data-request-zavuch')
        },
        sendRequest : function(data){
            return $http.post('/presents/send-request-zavuch', data)
        },
        setWasAll : function(data){
            return $http.post('/presents/set-was-all', data, {headers : {'show-loader': ''}})
        },
        setWasTypeAll : function(data){
            return $http.post('/presents/set-was-type-all', data, {headers : {'show-loader': ''}})
        },
        setComment : function(data){
            return $http.post('/presents/set-comment', data)
        },
        setPrize : function(data){
            return $http.post('/presents/set-prize', data, {headers : {'show-loader': ''}})
        },
        stopPair : function(data){
            return $http.post('/presents/stop-pair', data)
        },
        uploadMaterials : function(data){
            return $http.post('/', data)
        },
        getRecommendedTest : function(data){
            return $http.post('/presents/get-test-list', data);
        },
        getUnitTypes : function(data){
            return $http.get('/dom-zad-auto-unit/types', data);
        },
        getUnitLanguages : function(data){
            return $http.get('/dom-zad-auto-unit/languages', data);
        },
        getUnitVersions : function(data){
            return $http.get('/dom-zad-auto-unit/versions', data);
        },
        testingUnit : function(data){
            return $http.post('/presents/testing-unit', data);
        },
    };
}]);
