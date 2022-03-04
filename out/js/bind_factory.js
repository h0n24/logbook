/**
 * Created by vovk on 09.09.2016.
 */
var app = angular.module('app');

app.factory('bindHttp', ['$http', function($http){
    return {
        getPublicForm : function (data) {
            return $http.post('/bind/get-public-form', data);
        },
        getPublicSpec : function(data){
            return $http.post('/bind/get-public-spec', data);
        },
        getPublicMaterials : function(data){
            return $http.post('/bind/get-materials', data);
        },
        editMaterials : function(data){
            return $http({
                    url : '/bind/new-materials',
                    data : data,
                    headers : {'Content-Type': undefined},
                    transformRequest: angular.identity,
                    method  : 'POST'
                }
            );
        },
        getMaterialsTypes : function(data){
            return $http.post('/bind/get-materials-type', data);
        },
        getWeekList : function(data){
            return $http.post('/bind/get-count-week', data);
        },
        addWeek : function(data){
            return $http.post('/bind/add-week', data);
        },
        editTheme : function(data){
            return $http.post('/bind/edit-theme', data);
        },
        getTestList : function(data){
            return $http.post('/bind/get-test-list', data);
        },
        saveTest : function(data){
            return $http.post('/bind/new-materials', data);
        },
        getCity : function(){
            return $http.post('/bind/city-list');
        },
        getTeachList : function(data){
            return $http.post('/bind/get-teach-list', data);
        },
        getAuthorList : function(data){
            return $http.post('/bind/get-author-list', data);
        },
        addAuthor : function(data){
            return $http.post('/bind/add-author', data);
        },
        deleteAuthor : function(data){
            return $http.post('/bind/delete-author', data);
        },
        deleteMaterial : function(data){
            return $http.post('/bind/delete-material', data);
        },
        getStreams : function(data){
            return $http.post('/bind/get-streams', data);
        },
        getCityForm : function(data){
            return $http.post('/bind/get-city-forms', data);
        },
        getCitySpec : function(data){
            return $http.post('/bind/get-city-spec', data);
        },
        getLinkingMethod : function(data){
            return $http.post('/bind/get-linking-method', data);
        },
        createLink : function(data){
            return $http.post('/bind/create-link', data);
        },
        deleteLink : function(data){
            return $http.post('/bind/delete-link', data);
        },
        setAccessLink : function(data){
            return $http.post('/bind/set-type-link', data);
        },
        getTeachMaterials : function(data){
            return $http.post('/bind/get-teach-materials', data);
        },
        getCitySpecLinking : function(data){
            return $http.post('/bind/get-city-spec-linking', data);
        },
        isAuthorMethod : function(data){
            return $http.post('/bind/is-author', data);
        },
        addSpec : function(data){
            return $http.post('/bind/add-spec', data);
        },
        changeAuthorLang : function(data){
            return $http.post('/bind/change-author-lang', data);
        },
        addLinkingForm : function(data){
            return $http.post('/bind/add-linking-form', data);
        },
        removeLinkingForm : function(data){
            return $http.post('/bind/remove-linking-form', data);
        },
        getLinkingForm : function(data){
            return $http.post('/bind/get-linking-form', data);
        },
        getAllDirection : function(data){
            return $http.post('/bind/get-public-direction', data);
        },
        setSharedTeachMaterials : function(data){
            return $http.post('/bind/set-shared-teach-materials', data);
        },
        getCityDirection : function(data){
            return $http.post('/bind/get-city-direction', data);
        },
        editPublicDirection : function(data){
            return $http.post('/bind/edit-public-direction', data);
        },
        removePublicDirection : function(data){
            return $http.post('/bind/remove-public-direction', data);
        },
        getSpecLinks : function(data){
            return $http.post('/bind/get-spec-linking', data);
        },
        createSpecLink : function(data){
            return $http.post('/bind/create-spec-link', data);
        },
        removeLinkSpec : function(data){
            return $http.post('/bind/remove-spec-link', data);
        },
        runAutoLink : function(data){
            return $http.post('/bind/auto-links', data);
        },
        removeAutoLink : function(data){
            return $http.post('/bind/remove-auto-link', data);
        },
        copyMethodPackage : function(data){
            return $http.post('/bind/copy-method-package', data);
        },
        sendRequestCopyMethodPackage : function(data){
            return $http.post('/bind/send-request-copy-method-package', data);
        },
        getCityGroups : function(data){
            return $http.post('/bind/get-city-groups', data);
        },
        deletePackage : function(data){
            return $http.post('/bind/delete-method-package', data);
        },
        restorePackage : function(data){
            return $http.post('/bind/restore-method-package', data);
        },
        getBindCities : function (data) {
            return $http.post('/bind/get-bind-cities', data);
        },
        readMaterialsLogs : function (data) {
            return $http.post('/bind/read-materials-logs', data);
        },
        getUnreadLogs : function(data){
            return $http.post('/bind/get-unread-logs', data);
        },
        copyPackageFromWeek : function (data) {
            return $http.post('/bind/copy-week-package', data);
        },
        actualeMaterial: function (data) {
            return $http.post('/bind/actualization-materials', data);
        },
        saveMaterialCover: function (data) {
            return $http.post('/bind/save-material-cover', data);
        },
        getCovers: function (data) {
            return $http.post('/bind/get-cover', data);
        },
        deleteMaterials: function (data) {
            return $http.post('/bind/delete-materials', data);
        }
    };
}]);