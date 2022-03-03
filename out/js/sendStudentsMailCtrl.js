/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');

app_module.controller('sendStudentsMailCtrl', ['$scope', 'studentsHttp', '$mdToast', sendStudentsMailCtrl]);

function sendStudentsMailCtrl($scope, studentsHttp, $mdToast){

    $scope.sendMsg = function(stud, msg){
        studentsHttp.sendMsg({stud : stud, msg : msg}).success(function(r){
            if(r.success){
                // Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });

                $scope.sender.message = '';
            }else{
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            }
        })
    }
}