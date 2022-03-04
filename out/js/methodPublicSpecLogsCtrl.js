/**
 * Created by vovk on 06.09.2017.
 */
var app = angular.module('app');
app.controller('methodPublicSpecLogsCtrl', ['$scope', 'logsHttp', 'bindHttp', '$mdDialog', methodPublicSpecLogsCtrl]);

function methodPublicSpecLogsCtrl($scope, logsHttp, bindHttp, $mdDialog){

    $scope.currentPage = 0;
    $scope.limit = 200;
    $scope.$parent.logsActive = 'public_spec';

    $scope.getPublicSpecLog = function(data){
        $scope.currentPage = 0;
        logsHttp.getPublicSpecLog(data).success(function(r){
            var arrP = [];
            for(var i = 1; i <= Math.ceil(r.total/$scope.limit); i++){
                arrP.push(i);
            }
            $scope.coutPage = arrP;
            if(r.logsList){
                $scope.publicSpecLogs = r.logsList;
            }
        });
    };

    $scope.showDetailsMaterialLog = function(id){
        logsHttp.showDetailsSpecLog({id : id}).success(function(r){
            $scope.detailsSpecLog = r;
            $mdDialog.show({
                contentElement: '#details_spec',
                clickOutsideToClose: true
            });
        });
    };

    $scope.handler = function(e){
        var data = new Object();
        data.offset = e.target.text - 1;
        data.limit = $scope.limit;
        data.data = $scope.filter;

        $scope.getPublicSpecLog(data);
        $scope.currentPage = data.offset;
    };

    $scope.getPublicSpecLog();
}