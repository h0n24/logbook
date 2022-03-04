/**
 * Created by vovk on 13.01.2017.
 */
var app = angular.module('app');
app.controller('methodLinkingLogsCtrl', ['$scope', methodLinkingLogsCtrl]);

function methodLinkingLogsCtrl($scope){

    $scope.$parent.logsActive = 'linking';

    $scope.filter.date_start = new Date();
    $scope.filter.date_end = new Date();

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };
}