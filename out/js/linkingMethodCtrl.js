/**
 * Created by vovk on 07.09.2016.
 */
var app = angular.module('app');
app.controller('linkingMethodCtrl', ['$scope', linkingMethodCtrl]);

function linkingMethodCtrl($scope){
    $scope.getCityForm();
    $scope.getLinkingMethod();
}