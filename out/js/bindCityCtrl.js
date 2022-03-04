/**
 * Created by Milkevich on 20.04.2017.
 */
var app = angular.module('app');
app.controller('bindCityCtrl', ['$scope', '$controller', 'bindHttp', bindCityCtrl]);

function bindCityCtrl($scope, $controller, bindHttp){

    $scope.current_form = null;
    $scope.current_direction = null;
    $scope.current_spec = null;

    $scope.getPublicForm = function(){
        bindHttp.getPublicForm({link : 1}).success(function(r){
            if(r){
                $scope.public_form = r;
            }
        });
    };

    $scope.getPublicDirection = function(form){
        bindHttp.getAllDirection({form : form}).success(function(r){
            if(r){
                $scope.public_direction = r;
            }
        });
    };

    $scope.getPublicSpec = function(form, direction){
        $scope.current_form = form;
        bindHttp.getPublicSpec({form : form, direction : direction}).success(function(r){
            $scope.public_spec = r;
        });
    };

    $scope.getBindCities = function(spec){
        bindHttp.getBindCities({spec: spec}).success(function(r){
            if(r){
                $scope.packages = r;
            }
        });
    };

    $scope.getPublicForm();
    $scope.getPublicSpec($scope.current_form,  $scope.current_direction);
}