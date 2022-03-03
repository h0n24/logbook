/**
 * Created by vovk on 26.06.2020.
 */
var app_module = angular.module('app');

app_module.controller('courseWorksCtrl', ['$scope', 'examsHttp', '$filter', '$rootScope', courseWorksCtrl]);

app.run(function ($rootScope, baseHttp) {
    baseHttp.getArrayMarks().success(function(r){
        $rootScope.arrayMarks = r.reverse();
    });
});

/**
 *
 * Контроллер для работы с курсовыми
 *
 * @param $scope
 * @param examsHttp
 * @param $filter
 * @param $rootScope
 */
function courseWorksCtrl($scope, examsHttp, $filter, $rootScope){
    /**
     * Прослушка изменений массива оценок, полученных с сервера.
     */
    $rootScope.$watch('arrayMarks', function(newValue, oldValue, scope) {
        if (newValue === oldValue) {return;}
        if(Object.prototype.toString.call(newValue) === '[object Array]'){
            $scope.initMarks();
        }
    });

    /**
     * Инициализвция оценок для выпадающих списков
     */
    $scope.initMarks = function () {

        $scope.tempCourseWorkMarks = [];
        $scope.courseWorkMarks = {};

        angular.forEach($rootScope.arrayMarks, function(value, key) {
            $scope.tempCourseWorkMarks[key] = value;
        });
        $scope.courseWorkMarks['-0'] = $filter('translate')('MARK_TYPE_ABSENT'); //для корректной сортировки установлен минусовой индекс
        angular.forEach($scope.tempCourseWorkMarks, function(value, key) {
            $scope.courseWorkMarks[value] = String(value);
        });
    };

    /**
     * Получение списка курсовых
     *
     * @param filters
     */
    $scope.getCourseWorks = function (filters) {
        examsHttp.getCourseWorks(filters).success(function(r){
            $scope.courseWorksList = r;
        });
    };

    /**
     *
     * Поставить оценку за курсовую
     *
     * @param mark
     * @param idCourseWork
     */
    $scope.setMark = function (mark, idCourseWork) {
        if (mark == null) {
            return true;
        }
        examsHttp.setMarkCourseWork({'mark': mark, 'is_course_work': idCourseWork}).success(function (r) {});
    };

    /**
     * Проставить тему курсовой
     *
     * @param theme
     * @param idCourseWork
     */
    $scope.setThemeCourseWork = function (theme, idCourseWork) {
        examsHttp.setThemeCourseWork({'theme': theme, 'id_course_work': idCourseWork});
    };

    $scope.getCourseWorks({});
    $scope.initMarks();
}
