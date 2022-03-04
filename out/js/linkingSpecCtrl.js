/**
 * Created by vovk on 07.09.2016.
 */
var app = angular.module('app');
app.controller('linkingSpecCtrl', ['$scope','bindHttp', '$mdDialog', '$filter', '$mdToast', linkingSpecCtrl]);

function linkingSpecCtrl($scope, bindHttp, $mdDialog, $filter, $mdToast){

    $scope.filterS = {};

    $scope.getCityForm = function(){
        bindHttp.getCityForm().success(function(r){
            $scope.city_form = r;
        });
    };

    $scope.getPublicSpec = function(form){
        $scope.materials = {};
        $scope.current_spec = '';
        bindHttp.getPublicSpec({form : form, type : 'city'}).success(function(r){
            $scope.public_spec = r;
        });
    };

    $scope.getCitySpec= function(form){
        bindHttp.getCitySpec({form : form}).success(function(r){
            $scope.specs = r;
        });
    };

    $scope.getSpecs = function(form){
        $scope.getPublicSpec(form);
        $scope.getCitySpec(form);
    };

    $scope.getSpecLinks = function(spec, form){
        bindHttp.getSpecLinks({spec : spec, form : form}).success(function(r){
            if(r) {
                $scope.links = r;
            }
        });
    };

    $scope.createSpecLink = function(spec, method_package){
        bindHttp.createSpecLink({spec : spec, method_package : method_package}).success(function(r){
            if (r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            }
            else if (r.success) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.getSpecLinks($scope.filterS.city_spec);
            }
        });
    };

    $scope.removeLinkSpec = function(id){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('msg_confirm_delete_methodpackage'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.removeLinkSpec({id : id}).success(function(r){
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
                    $scope.getSpecLinks($scope.filterS.city_spec);
                }
            });
        });
    };

    $scope.runAutoLink = function(){
        bindHttp.runAutoLink().success(function(r){
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
            }
        });
    };

    $scope.removeAutoLink = function(id){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('confirm_delete_autolink'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.removeAutoLink({id : id}).success(function(r){
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
                }
            });
        });
    };

    $scope.getCityForm();
    $scope.getPublicSpec();
    $scope.getCitySpec();
}
