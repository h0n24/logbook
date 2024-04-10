/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');

app_module.controller('mainStudCtrl', ['$scope', 'studentsHttp', '$state', 'localStorageService', '$location',
    '$rootScope', '$mdDialog', '$filter', '$mdToast', mainStudCtrl])

function mainStudCtrl($scope, studentsHttp, $state, localStorageService, $location, $rootScope, $mdDialog, $filter, $mdToast){
    $scope.curGroup = 0;
    $scope.curGroup = 0;
    $scope.students_sender = {};
    $scope.groups_sender = [];
    $scope.sender = {};
    $scope.place = [];
    $scope.cur_group = localStorageService.get('cur_select_group');
    $scope.isHasGroups = true;

    $scope.getActiveTab = function () {
        if ($location.url() === '/students/comment') {
            return 'students.comment';
        } else if ($location.url() === '/students/send_mail') {
            return 'students.send_mail';
        } else {
            return 'students.list'
        }
    }

    $scope.redirect = function(url){
        $state.go(url);
    };

    $scope.getGroups = function(){
        studentsHttp.getGroups().success(function(r){
            $scope.isHasGroups = !!r;
            if(r) {
                $scope.groups = r;
            }else{
                $scope.groups = false;
            }
        })
    };

    $scope.getStudents = function(cur_group, savegroup){
        if(savegroup){
            localStorageService.set('cur_select_group', cur_group);
            $scope.cur_group = localStorageService.get('cur_select_group');
        }
        setTimeout(function(){
            delete $scope.students;
            $scope.$apply();
            studentsHttp.getStudents({group : cur_group}).success(function(r){
                $scope.students = r;
            })
        }, 100);
    };


    $scope.getStudentsShort = function(group){
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_comment = r;
        });
        $scope.curStud = -1;
    };

    $scope.getStudentsSender = function(group){
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_sender = r;
            $scope.sender.students = [];
            angular.forEach($scope.students_sender, function(val){
                $scope.sender.students.push('' + val.id_stud);
            });
        });
    };
    $scope.getGroups();

    $scope.$watch('isHasGroups', function (value, old) {
        if ($scope.isHasGroups === false && $location.url() === '/students/comment') {
            let $commentController = new studentsCommentCtrl(
                $scope,
                studentsHttp,
                $mdDialog,
                $filter,
                $mdToast,
                $rootScope,
                $location
            );
        }
    });
}