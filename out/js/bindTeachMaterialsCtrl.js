/**
 * Created by vovk on 06.09.2016.
 */
var app = angular.module('app');
app.controller('bindTeachMaterialsCtrl', ['$scope', 'bindHttp', 'localStorageService', '$mdDialog', '$filter', '$mdToast', bindTeachMaterialsCtrl]);

function bindTeachMaterialsCtrl($scope, bindHttp, localStorageService, $mdDialog, $filter, $mdToast){

    $scope.filter = angular.isObject(localStorageService.get('teach_material_filter')) ? localStorageService.get('teach_material_filter') : {};
    $scope.filter.date_start = new Date();
    $scope.filter.date_end = new Date();

    $scope.getMaterialsType();
    $scope.getCity();
    $scope.getPublicForm();

    $scope.getTeachMaterials = function(){
        localStorageService.set('teach_material_filter', $scope.filter);
        bindHttp.getTeachMaterials($scope.filter).success(function(r){
            $scope.teach_materials = r;
            $scope.teach_materials.forEach(function (elem) {
                elem.time = Date.parse(elem.date_vizit);
            });
        });
    };

    $scope.getCitySpecLinking = function(){
        bindHttp.getCitySpecLinking($scope.filter).success(function(r){
            $scope.specs = r;
        });
    };

    $scope.getCityGroups = function(){
        bindHttp.getCityGroups($scope.filter).success(function(r){
            $scope.groups = r;
        });
    };

    $scope.setShared = function(id, shared, elIndex){

        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        }).title($filter('translate')('delete_materials_confirm'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function() {
            bindHttp.setSharedTeachMaterials({id: id, shared: shared}).success(function (r) {
                if (r.error) {
                    angular.forEach(r.error, function (value, key) {
                        $mdToast.show({
                            hideDelay : 4000,
                            position : 'top right',
                            template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                        });
                    });
                }else if (r.success) {
                    $scope.teach_materials.splice(elIndex, 1);
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                    });
                }
            });
        });
    };

    $scope.getCityDirection = function(form, city){
        bindHttp.getCityDirection({city : city, form : form}).success(function(r){
            if(r) {
                $scope.directions = r;
            }
        });
    };

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };

    if($scope.filter){
        if(angular.isDefined($scope.filter.public_form) && angular.isDefined($scope.filter.city)){
            $scope.getCityDirection($scope.filter.public_form, $scope.filter.city);
            $scope.getCitySpecLinking();
        }
    }

    $scope.getTeachMaterials();
}


