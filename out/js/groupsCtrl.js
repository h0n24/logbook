var app = angular.module('app');
app.controller('groupsCtrl', ['$scope', '$sce', 'groupsHttp', groupsCtrl]);
function groupsCtrl($scope, $sce, groupsHttp) {


    $scope.filter = {};
    $scope.offset = 0;
    $scope.getStartData = function(){
        groupsHttp.getStartData().success(function(r){
            $scope.filter_data = r.groups_spec;
            $scope.setDefaultGroup();
            $scope.setDefaultSpec();//устанавливаем дефолтное значение
            $scope.getStudents({id_tgroups : $scope.filter.group, spec : $scope.filter.spec});
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

    $scope.setDefaultSpec = function(){
        var max = 0;
        if ($scope.filter_data.length > 0) {
            angular.forEach($scope.filter_data[$scope.filter.group].data, function(value, key){
                if(+max < +value.order){
                    max = value.order;
                    $scope.filter.spec = value.id_spec;
                }
            });
        }
    };

    $scope.setDefaultGroup = function(){
        var max = 0;
        angular.forEach($scope.filter_data, function(value, key){
            if(max < value.order){
                max = value.order;
                $scope.filter.group = value.id_tgroups;
            }
        });
    }

    $scope.getTableData = function()
    {
        groupsHttp.getTableData({
            id_tgroups : $scope.filter.group,
            id_spec : $scope.filter.spec,
            limit : $scope.limit,
            offset : $scope.offset
        }).success(function(r){
            $scope.data_body = r.data_body;
            $scope.data_header_full = r.data_header;
            $scope.data_header = ($scope.data_header_full.length > $scope.limit) ? $scope.data_header_full.slice($scope.offset, $scope.limit) : $scope.data_header_full;
            $scope.startPosition =  $scope.data_header_full.length;
        })
    }

    $scope.changeGroup = function(){
        $scope.offset = 0;
        $scope.setDefaultSpec();
        $scope.getStudents({id_tgroups : $scope.filter.group, spec : $scope.filter.spec});
        $scope.getTableData();
    }

    $scope.getStudents = function(data){
        groupsHttp.getStudents(data).success(function(r){
            $scope.stud_list = r;
        })
    }

    $scope.convertTime = function (start, end) {
        return start && end ? `${start.split(':').slice(0,2).join(':')} - ${end.split(':').slice(0,2).join(':')}` : '';
    }

    $scope.changeSpec = function(){
        $scope.offset = 0;
        $scope.getStudents({id_tgroups : $scope.filter.group, spec : $scope.filter.spec});
        $scope.getTableData();
    }

    $scope.changeOffset = function(k){
        if($scope.offset > 0 || k > 0){
            $scope.offset = $scope.offset + k*$scope.limit;
        }
        $scope.data_header = $scope.data_header_full.slice($scope.offset, $scope.offset + $scope.limit);
        $scope.startPosition =  $scope.data_header_full.length - $scope.offset;
    }

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    $scope.getStartData();

}
