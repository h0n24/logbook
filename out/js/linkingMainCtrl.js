/**
 * Created by vovk on 06.09.2016.
 */
var app = angular.module('app');
app.controller('linkingMainCtrl', ['$scope','$state','bindHttp','$timeout', '$mdDialog', '$filter', '$mdToast', linkingMainCtrl]);

function linkingMainCtrl($scope, $state, bindHttp, $timeout, $mdDialog, $filter, $mdToast){
    $scope.redirect = function(url){
        $state.go(url);
        $state.linkingActive = url;
        $scope.linkingActive = url;
    };
    $scope.filter = {};
    $scope.linking_data = {};

    $scope.getCityForm = function(){
        bindHttp.getCityForm().success(function(r){
            $scope.city_forms = r;
        });
    };

    $scope.getLinkingMethod = function(){
        bindHttp.getLinkingMethod($scope.filter).success(function (r) {
            $scope.linking_data = r;
        });
    };

    $scope.getStreams = function(form){
        $scope.getLinkingMethod();
        bindHttp.getStreams({form: form}).success(function (r) {
            $scope.streams_list = r;
        });
    };

    $scope.getCitySpec = function(form){
        $scope.getLinkingMethod();
        if($scope.filter.id_streams != null){
            bindHttp.getCitySpec({form: form}).success(function (r) {
                $scope.city_spec = r;
            });
        }else {
            $scope.city_spec = null;
        }
    };

    $scope.getPublicSpec = function(form){
        $scope.getLinkingMethod();
        if($scope.filter.id_spec != null) {
            bindHttp.getPublicSpec({form: form, type: 'city'}).success(function (r) {
                $scope.public_spec = r;
            });
        }else{
            $scope.public_spec = null;
        }
        $scope.filter.id_publicSpec = null;
    };

    $scope.createLink = function(data){
        var temp_data =  $scope.linking_data;
        $scope.linking_data = {};
        $timeout(function () {
            $scope.$apply();
            bindHttp.createLink(data).success(function (r) {
                if (r.error) {
                    $scope.linking_data = temp_data;
                    angular.forEach(r.error, function (value, key) {
                        $mdToast.show({
                            hideDelay   : 4000,
                            position    : 'top right',
                            template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                        });
                    });
                } else if (r.success) {
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                    });
                    $scope.getLinkingMethod();
                }
            });
        }, 100);
    };

    $scope.deleteLink = function(stream, spec, public_spec){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('msg_delete_link_form'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.deleteLink({
                id_streams: stream,
                id_spec: spec,
                id_publicSpec: public_spec
            }).success(function (r) {
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
                    $scope.getLinkingMethod();
                }
            });
        });
    };

    /**
     * смена доступности метод пакетов
     */
    $scope.setAccessLink = function(stream, spec, public_spec, type){
        bindHttp.setAccessLink({
            id_streams: stream,
            id_spec: spec,
            id_publicSpec: public_spec,
            type_vizit: type,
        }).success(function (r) {
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
            }
        });
    };
}