/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');

app_module.controller('mainStudCtrl', ['$scope', 'studentsHttp', '$state', 'localStorageService', mainStudCtrl]);

function mainStudCtrl($scope, studentsHttp, $state, localStorageService){

    $scope.activeTab_stud =  localStorageService.get('activeTab_stud');
    $scope.curGroup = 0;

    $scope.redirect = function(url){
        $scope.activeTab_stud = url;
        localStorageService.set('activeTab_stud', url);
        $state.go(url);
    };
    $scope.curGroup = 0;
    $scope.students_sender = {};
    $scope.groups_sender = [];
    $scope.sender = {};
    $scope.place = [];
    $scope.cur_group = localStorageService.get('cur_select_group');


    $scope.getGroups = function(){
        studentsHttp.getGroups().success(function(r){
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
                // function compareNumbers(a, b) {
                //     return a - b;
                // }
                //
                // var tempArray = [];
                // for (var i = 0, maxI = r.length; i < maxI; i += 1) {
                //     tempArray[i] = +r[i].gpa;
                // }
                // tempArray = tempArray.sort(compareNumbers).reverse();
                //
                // for (var i = 0, maxI = r.length; i < maxI; i += 1) {
                //     var rate = -1, j = 0;
                //
                //     while (rate != j) {
                //         if (r[i].gpa == tempArray[j]){
                //             rate = j;
                //         } else {
                //             j += 1;
                //         }
                //     }
                //     $scope.place[i] = rate + 1;
                // }
                // for (var i = 0, maxI = r.length; i < maxI; i += 1) {
                //     tempArray[i] = $scope.place[maxI - 1 - i];
                // }
                // $scope.place = tempArray;


            })
        }, 100);
    };


    $scope.getStudentsShort = function(group){
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_comment = r;
        });
        $scope.curStud = -1;
        // $scope.curGroup = this.$index;
        // if(angular.isDefined(index)){
        //     $scope.curGroup = index;
        // }
    };

    $scope.getStudentsSender = function(group){
        // if(($scope.groups_sender.indexOf(group.id_tgroups)) != -1){
        //     $scope.groups_sender.splice($scope.groups_sender.indexOf(group.id_tgroups), 1);
        // }else{
        //     $scope.groups_sender.push(group.id_tgroups);
        // }
        studentsHttp.getStudentsShort({group : group}).success(function(r){
            $scope.students_sender = r;
            $scope.sender.students = [];
            angular.forEach($scope.students_sender, function(val){
                $scope.sender.students.push('' + val.id_stud);
            });
        });
        //$scope.curGroup = this.$index;
        // this.curGroup = !this.curGroup;
    };
    $scope.getGroups();
}