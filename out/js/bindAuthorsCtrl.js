/**
 * Created by vovk on 23.12.2016.
 */
var app = angular.module('app');
app.controller('bindAuthorsCtrl', ['$scope','bindHttp', '$timeout', '$mdToast', bindAuthorsCtrl]);

function bindAuthorsCtrl($scope, bindHttp, $timeout, $mdToast){
    $scope.form_author = {};
    $scope.form_author.type = 1;
    $scope.teachList = {};

    $scope.getAuthorList = function(){
        bindHttp.getAuthorList({type : 1}).success(function (r) {
            $scope.authorList = r;
        });
    };

    $scope.addAuthor = function(){
        bindHttp.addAuthor($scope.form_author).success(function(r){
            if(r.success) {
                $scope.authorList = {};
                $scope.getAuthorList();
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
            }else{
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }
        });
    };

    $scope.getTeachList = function(){
        bindHttp.getTeachList({city : $scope.form_author.city}).success(function(r){
            $scope.teachList = r;
        });
    };

    $scope.deleteAuthor = function(id, type){
        $scope.authorList = {};
        bindHttp.deleteAuthor({id: id, type : type}).success(function (r) {
            $scope.getAuthorList();
            $mdToast.show({
                hideDelay   : 4000,
                position    : 'top right',
                template: '<md-toast class="md-toast green">' + 'Автор успешно удален' + '</md-toast>',
            });
        });
    };

    $scope.getCity();
    $scope.getAuthorList();
}