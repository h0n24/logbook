/**
 * Created by vovk on 05.10.2016.
 */
var app_module = angular.module('app');

app_module.controller('studentProfileCtrl', ['$scope', '$sce', 'studentsHttp', '$stateParams', 'localStorageService', studentProfileCtrl]);

function studentProfileCtrl($scope, $sce, studentsHttp, $stateParams, localStorageService) {

    $scope.stud_info = localStorageService.get('stud_object');
    $scope.stud_id = ($scope.stud_info) ? $scope.stud_info.id_stud : false;

    studentsHttp.getComments({stud: $scope.stud_info.id_stud}).then(
        function (res) {
            $scope.stud_info.count_comment = res.data.length;
        }
    );

    $scope.getDetailsGroup = function (group) {
        studentsHttp.getGroupDetails({group: group}).success(function (r) {
            if (r) {
                $scope.stud_info.stream = r.name_streams;
                $scope.stud_info.dir_name = r.dir_name;
                $scope.stud_info.name_tgroups = r.name_tgroups;
            }
        })
    };

    $scope.getDetailsStud = function (stud) {
        if (stud) {
            studentsHttp.getDetailsStud({stud: stud}).success(function (r) {
                $scope.stud_info_d = r;
            });
        } else {
            goBack();
        }
    };

    $scope.getVizitInfo = function (stud) {
        if (stud) {
            studentsHttp.getVizitInfo({stud: stud}).success(function (r) {
                if (r) {
                    $scope.vizit_info = r;
                }
            })
        } else {
            goBack();
        }
    };

    function goBack() {
        window.location.href = 'https://logbook.itstep.org/#/students/list';
    }

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    $scope.getVizitInfo($scope.stud_id);
    $scope.getDetailsStud($scope.stud_id);
}
