/**
 * Created by vovk on 03.01.2017.
 */
var app = angular.module('app');
app.controller('linkingFormCtrl', ['$scope', 'bindHttp', '$mdDialog', '$filter', '$mdToast', linkingFormCtrl]);

function linkingFormCtrl($scope, bindHttp, $mdDialog, $filter, $mdToast){

    $scope.form = {};

    $scope.getCityForm = function(){
        bindHttp.getCityForm({link : 1}).success(function(r){
            if(r){
                $scope.cityForms = r;
            }
        });
    };

    $scope.getPublicForm = function(){
        bindHttp.getPublicForm({link : 1}).success(function(r){
            if(r){
                $scope.publicForms = r;
            }
        });
    };

    $scope.getLinkingForm = function(){
        bindHttp.getLinkingForm().success(function(r){
            if(r){
                $scope.linkingForm = r;
            }
        });
    };

    $scope.addLinkingForm = function(form){
        bindHttp.addLinkingForm(form).success(function(r){
            if(r.success){
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.getCityForm();
                $scope.getLinkingForm();
            }
        });
    };

    $scope.removeLinkingForm = function(linkingId){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('msg_delete_link_form'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.removeLinkingForm({id : linkingId}).success(function(r){
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
                    $scope.getCityForm();
                    $scope.getLinkingForm();
                }
            });
        });
    };

    $scope.getCityForm();
    $scope.getPublicForm();
    $scope.getLinkingForm();
}