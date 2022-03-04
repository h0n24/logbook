/**
 * Created by vovk on 05.01.2017.
 */
var app = angular.module('app');
app.controller('linkingDirectionCtrl', ['$scope', 'bindHttp', '$mdDialog', '$translate', '$filter', '$mdToast', linkingDirectionCtrl]);

function linkingDirectionCtrl($scope, bindHttp, $mdDialog, $translate, $filter, $mdToast){

    $scope.form = {};
    $scope.new_obj = false;

    $scope.getPublicForm = function(){
        bindHttp.getPublicForm({link : 1}).success(function(r){
            if(r){
                $scope.publicForms = r;
            }
        });
    };

    $scope.getPublicDirection = function(form){
        if(form == null){
            form = -1;
        }
        bindHttp.getAllDirection({form : form}).success(function(r){
            if(r){
                $scope.Edit_public_direction = {};
                angular.forEach(r, function(value, key){
                    $scope.Edit_public_direction[key] = {};
                    $scope.Edit_public_direction[key]['new'] = angular.copy(value);
                    $scope.Edit_public_direction[key]['old'] = angular.copy(value);
                });
            }
        });
    };

    $scope.copyObj =  function(source, destination) {
        if(!angular.equals(source,destination)){
            if (!!destination) {
                angular.copy(source, destination);
            }else {
                destination = angular.copy(source);
            }
        }

        return destination;
    };

    $scope.removePublicDirection = function(id){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        }).title($filter('translate')('msg_confirm_delete_direction'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.removePublicDirection({id : id}).success(function(r){
                if(r.error) {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                    });
                }else {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                    });
                    $scope.getPublicDirection($scope.form.idPublicForm);
                }
            });
        });
    };

    $scope.editPublicDirection = function(data){
        bindHttp.editPublicDirection(data).success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            }else {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                if($scope.new_obj) {
                    $scope.getPublicDirection($scope.form.idPublicForm);
                    $scope.new_obj = false;
                }
            }
        });
    };

    $scope.newDirection = function(){
        var length_obj =  $scope.Edit_public_direction.length;
        $scope.Edit_public_direction[length_obj] = {};
        $scope.Edit_public_direction[length_obj]['new'] = {};
        $scope.Edit_public_direction[length_obj]['old'] = {};
        $scope.new_obj = true;
    };

    $scope.getPublicForm();
    $scope.getPublicDirection(-1);
}