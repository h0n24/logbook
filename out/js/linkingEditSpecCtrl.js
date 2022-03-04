/**
 * Created by vovk on 03.01.2017.
 */
var app = angular.module('app');
app.controller('linkingEditSpecCtrl', ['$scope', 'bindHttp', '$mdDialog', '$filter', '$mdToast', linkingEditSpecCtrl]);

function linkingEditSpecCtrl($scope, bindHttp, $mdDialog, $filter, $mdToast){

    $scope.form = {};
    $scope.form.idPublicForm = 1;
    $scope.getPublicForm = function(){
        bindHttp.getPublicForm({link : 1}).success(function(r){
            if(r){
                $scope.publicForms = r;
            }
        });
    };

    $scope.getPublicDirection = function(form, callback){
        bindHttp.getAllDirection({form : form}).success(function(r){
            if (r) {
                $scope.public_direction = r;
                if (callback) {
                    callback();
                }
            }
        });
    };

    $scope.changePublicDirection = function(form, obj){
        bindHttp.getAllDirection({form : form}).success(function(r){
            if (r) {
                obj.dirList = r;
            }
        });
    };

    $scope.getPublicSpec = function(form, direction){
        bindHttp.getPublicSpec({form : form, direction : direction}).success(function(r){
            $scope.getPublicDirection(form, function(){
                $scope.public_spec = r;
                var tempSpec = {};
                angular.forEach($scope.public_spec, function(value, key){
                    value.dirList = $scope.public_direction;
                    value.id_spec = value.id;
                    value.id_direction = '' + value.id_direction;
                    tempSpec = value;
                    value.new = angular.copy(tempSpec);
                    value.old = angular.copy(tempSpec);
                });
            });
        });
    };

    $scope.editSpec = function(data){
        bindHttp.addSpec(data).success(function(r){
            if(r.success) {
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

    $scope.getPublicForm();
    $scope.getPublicSpec(1);
}