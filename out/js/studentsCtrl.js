var app_module = angular.module('app');

app_module.controller('studentsCtrl', ['$scope', 'studentsHttp', 'localStorageService', studentsCtrl]);

function studentsCtrl($scope, studentsHttp, localStorageService){

    if($scope.groups) {
        $scope.getStudents($scope.$parent.cur_group, false)
    }
    $scope.goStud = function(stud){
        localStorageService.set('stud_object', stud);
    }
}