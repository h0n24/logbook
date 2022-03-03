var app_module = angular.module('app');

app_module.controller('classWorkCtrl', ['$scope', 'classworkHttp', '$rootScope',  '$mdToast', 'reportHttp', classWorkCtrl])

function classWorkCtrl($scope, classworkHttp, $rootScope, $mdToast, reportHttp){

    let d = new Date();

    $scope.years = []; // годы для фильтра
    $scope.months = []; // месяцы для фильтра

    // модель для селектов выбора года и месяца
    $scope.form = {
        year: '',
        month: '',
    };

    $scope.maxYear = d.getFullYear();
    $scope.minYear = 2014;

    $scope.getStartDate = function(){
        for(let i= $scope.minYear, j=0; i <= $scope.maxYear;i++, j++){
            $scope.years[j] = ('' + i);
        }
    };
    $scope.getStartDate();

    $scope.filter = {};
    $scope.offset = 0;
    $scope.getStartData = function(){
        classworkHttp.getStartData().success(function(r){
            $scope.filter_data = r.groups_spec;
            $scope.months = r.months;
            $scope.setDefaultGroup();
            $scope.setDefaultSpec();//устанавливаем дефолтное значение
            $scope.getStudents({id_tgroups : $scope.filter.group});
            $scope.setLimit();
            //$scope.limit  = r.limit;
            $scope.offset = 0;
            $scope.getTableData();
        })
    }

    $scope.setLimit = function(){
        var myWidth = window.innerWidth;

        if (myWidth > 1400){
            $scope.limit = 11;
        }else if (myWidth < 1400 && myWidth > 1300){
            $scope.limit = 10;
        }else if (myWidth < 1300 && myWidth > 1200){
            $scope.limit = 9;
        }else if (myWidth < 1200 && myWidth > 1100){
            $scope.limit = 8;
        }else if (myWidth < 1100 && myWidth > 1000){
            $scope.limit = 7;
        }else if (myWidth < 1000 && myWidth > 900){
            $scope.limit = 6;
        }else if (myWidth < 900 && myWidth > 800){
            $scope.limit = 5;
        }else if (myWidth < 800 && myWidth > 700){
            $scope.limit = 4;
        }else if (myWidth < 700 && myWidth > 600){
            $scope.limit = 3;
        }else if (myWidth < 600 && myWidth > 500){
            $scope.limit = 2;
        }else{
            $scope.limit = 1;
        }
    };

    $scope.getTableData = function()
    {
        classworkHttp.getTableData({
            id_tgroups : $scope.filter.group,
            id_spec : $scope.filter.spec,
            limit : $scope.limit,
            offset : $scope.offset,
            year: $scope.form.year,
            month: $scope.form.month
        }).success(function(r){
            $scope.data_body = r.data_body;
            $scope.table_header_full = r.data_header;
            $scope.data_header = ($scope.table_header_full.length > $scope.limit) ? $scope.table_header_full.slice($scope.offset, $scope.limit) : $scope.table_header_full;
            $scope.startPosition =  $scope.table_header_full.length;
            $scope.endPosition   =  $scope.table_header_full.length > $scope.limit ? ($scope.table_header_full.length - $scope.limit) : 1;
        })
    }

    $scope.setDefaultSpec = function(){
        var max = 0;
        angular.forEach($scope.filter_data[$scope.filter.group].data, function(value, key){
            if(max < value.order){
                max = value.order;
                $scope.filter.spec = value.id_spec;
            }
        });
    }

    $scope.setDefaultGroup = function(){
        var max = 0;
        angular.forEach($scope.filter_data, function(value, key){
            if(max < value.order){
                max = value.order;
                $scope.filter.group = value.id_tgroups;
            }
        });
    }

    $scope.changeGroup = function(){
        $scope.offset = 0;
        $scope.setDefaultSpec();
        $scope.getStudents({id_tgroups : $scope.filter.group});
        $scope.getTableData();
    }

    $scope.getStudents = function(data){
        classworkHttp.getStudents(data).success(function(r){
            $scope.stud_list = r;
        })
    }

    $scope.changeSpec = function(){
        $scope.offset = 0;
        $scope.getTableData();
    }

    // смена даты в фильтре
    $scope.changeDate = function(){
        $scope.offset = 0;
        $scope.getTableData();
    };

    $scope.changeOffset = function(k){
        if($scope.offset > 0 || k > 0){
            $scope.offset = $scope.offset + k*$scope.limit;
        }
        $scope.data_header = $scope.table_header_full.slice($scope.offset, $scope.offset + $scope.limit);
        $scope.startPosition =  $scope.table_header_full.length - $scope.offset;
        $scope.endPosition = ($scope.table_header_full.length > ($scope.offset + $scope.limit)) ?  ($scope.table_header_full.length - $scope.offset - $scope.limit) : 1;
    };

    $scope.setMark = function(type, mark, vizit, was){
        classworkHttp.setMark({
            type  : type,
            mark  : mark,
            vizit : vizit,
            was   : was
        }).success(function(r){
            if(r.error) {
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });

                return;
            }
        });
    };

    $scope.getStartData();
}

