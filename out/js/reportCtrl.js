
var app_module = angular.module('app');
app_module.controller('reportCtrl', ['$scope', '$sce', 'reportHttp', reportCtrl]);

app_module.filter('translateDay', function() {
  var translations = {
      'Mon': 'day_short_0',
      'Tue': 'day_short_1',
      'Wed': 'day_short_2',
      'Thu': 'day_short_3',
      'Fri': 'day_short_4',
      'Sat': 'day_short_5',
      'Sun': 'day_short_6'
  };

  return function(input) {
      return translations[input];
  };
});

function reportCtrl($scope, $sce, reportHttp){

    $scope.getWidthStartPosition = getWidthStartPosition;
    $scope.getLessonWidth = getLessonWidth;

    $scope.form = {};
    $scope.filterGroupReport = {};

    $scope.reportSchedule = [];

    $scope.select = {
        year: '',
        years: [],
        day: '',
        days: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
    };
    var d = new Date();

    $scope.form.month = '' + (d.getMonth() + 1);
    $scope.form.year  = '' + d.getFullYear();

    $scope.maxYear = d.getFullYear();
    $scope.minYear = 2014;

    $scope.getStartData = function(){
        for(var i= $scope.minYear, j=0; i <= $scope.maxYear;i++, j++){
            $scope.select.years[j] = ('' + i);
        }
        reportHttp.getStartData().success(function(r){
            $scope.months = r.months;
            $scope.study_forms  = r.study_forms;
        });
    };

    $scope.scrollTable = function(e){
        if(window.screen.width > 375) {
            var elem = e.target;
            var scrolledY = elem.pageYOffset || e.target.scrollTop;
            var scrolledX = elem.pageXOffset || e.target.scrollLeft;
            elem.querySelectorAll('tr > *:first-child').forEach(function (item) {
                item.style.transform = 'translate(' + (scrolledX > 50 ? scrolledX - 20 : scrolledX) + 'px, 0px)';
                if (scrolledX > 50) {
                    if (!item.classList.contains('scrolled')) {
                        item.classList.add('scrolled');
                    }
                } else {
                    if (item.classList.contains('scrolled')) {
                        item.classList.remove('scrolled');
                    }
                }
            });
            elem.querySelector('thead').style.transform = 'translate(0px, ' + scrolledY + 'px)';
        }
    };

    $scope.getReport = function(){
        reportHttp.getData($scope.form).success(function(r){
            if(r){
                $scope.report_data = r;
                $scope.reportSchedule = addEmptyProperty(r.details_report);
                $scope.showReport = 1;
            }else{
                $scope.showReport = 0;
            }
        });
    };

    $scope.getReportGroupFilter = function(data){
        function filterByGroup(obj) {
            if (!data.id_tgroups){
                return true;
            } else {
                if (data.id_tgroups == obj.id_tgroups){
                    return true;
                } else {
                    return false;
                }
            }
        }
        $scope.report_data_group = $scope.report_data_group_filter.filter(filterByGroup);
    };

    $scope.getReportGroup = function(data){
        reportHttp.getReportGroup(data).success(function (r) {
            if (angular.isDefined(r)) {
                $scope.report_data_group = r;
                $scope.report_data_group_filter = r;
            }
        });
    };

    $scope.getTeachGroups = function(){
        if(!$scope.groups) {
            reportHttp.getTeachGroups({onlyActiveGroup : 0}).success(function (r) {
                if (angular.isDefined(r)) {
                    $scope.groups = r;
                }
            });
        }
    };

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    $scope.getStartData();
    $scope.getReport();
}
