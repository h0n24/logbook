/**
 * Created by vovk on 12.08.2016.
 */
var app_module = angular.module('app');

var controller = app_module.controller('scheduleCtrl', ['$scope', '$sce', 'scheduleHttp', ScheduleController]);

function ScheduleController($scope, $sce, scheduleHttp){
    $scope.getLessonStartPosition = getLessonStartPosition;
    $scope.getLessonHeight = getLessonHeight;

    $scope.week = 0;
    $scope.thisDay = 0;
    $scope.r = 0;
    $scope.init_schedule = false;
    $scope.mappedSchedule = [];

    $scope.update_schedule = function() {
        scheduleHttp.getScheduleData({week: $scope.week}).success(function (r) {
            $scope.schedule = r.body;
            $scope.mappedSchedule = mapTeachersSchedule($scope.schedule);
            $scope.lents = r.lents;
            $scope.days =  r.days;
            $scope.dates = r.dates;
            $scope.curdate = r.curdate;
            $scope.start_end = r.start_end;
            $scope.daysShort = r.daysShort;
            $scope.r = r;
            if ($scope.init_schedule){
                $scope.init_schedule_day(r);
            }
            $scope.init_schedule = false;
            $scope.scheduleCur = $scope.r.body;
            $scope.lentsCur = $scope.r.lents;
            $scope.datesCur = $scope.r.dates[$scope.thisDay];
            $scope.curdateCur = $scope.r.curdate;
            $scope.daysShortCur = $scope.r.daysShort[$scope.thisDay];
        });
    };
    $scope.update_schedule();

    $scope.startT = function(arr) {
        return arr[Object.keys(arr)[0]].l_start;
    };

    $scope.endT = function(arr) {
        return arr[Object.keys(arr)[0]].l_end;
    };

    $scope.get_schedule = function(diff){
        $scope.week  = $scope.week + diff;
        $scope.update_schedule();
    };

    $scope.init_schedule_day = function(res) {
        var currentDayNum,
            dayName = res.curdate.split(',')[0];

        for (var key in res.days) {
            if (dayName == res.days[key]){
                currentDayNum = key;
            }
        }
        $scope.thisDay = currentDayNum;
        $scope.scheduleCur = res.body;
        $scope.lentsCur = res.lents;
        $scope.datesCur = res.dates[$scope.thisDay];
        $scope.curdateCur = res.curdate;
        $scope.daysShortCur = res.daysShort[$scope.thisDay];
        // const test = this.schedule.map(timeline => {
        //     for (let key in )
        // })
    }

    var update_schedule_day = function() {
        if ($scope.thisDay == 0){
            $scope.week  = $scope.week - 1;
            $scope.thisDay = 7;
            $scope.update_schedule();
        } else if ($scope.thisDay == 8){
            $scope.week  = $scope.week + 1;
            $scope.thisDay = 1;
            $scope.update_schedule();
        }
        $scope.scheduleCur = $scope.r.body;
        $scope.lentsCur = $scope.r.lents;
        $scope.datesCur = $scope.r.dates[$scope.thisDay];
        $scope.curdateCur = $scope.r.curdate;
        $scope.daysShortCur = $scope.r.daysShort[$scope.thisDay];
    };

    $scope.get_schedule_day = function(diff){
        $scope.thisDay  = Number($scope.thisDay) + diff;
        update_schedule_day();
    };

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };
}
