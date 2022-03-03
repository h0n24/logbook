
app = angular.module('app');

app.filter('viewTaskClass', function () {
    return function (item) {
        switch (item) {
            case "0":
                return 'status-new';
            case "1":
                return 'status-in-work';
            case "2":
                return 'status-miting';
            case "3":
                return 'status-statement';
            case "4":
                return 'status-finish';
            default :
                return 'empty'
        }
    }
});

app.filter('viewStatusName', function () {
    return function (item) {
        switch (item) {
            case "0":
                return 'new_signal';
            case "1":
                return 'in_work_signal';
            case "3":
                return 'statement_signal';
            case "4":
                return 'finished_signal';
        }
        return '-';
    }
});

app.filter('viewImplementer', ['$filter', function($filter) {
    return function (item) {
        var res = [];
        var re = /\s*,\s*/;
        if(item){
            var arr = item.split(re);

            arr.forEach(function (item, i, arr) {
                switch (item){
                    case "0":
                        res.push($filter('translate')('signal_admin'));
                        break;
                    case "1":
                        res.push($filter('translate')('signal_steward'));
                        break;
                    case "2":
                        res.push($filter('translate')('signal_head_teach'));
                        break;
                    case "3":
                        res.push($filter('translate')('signal_director'));
                        break;
                    case "4":
                        res.push($filter('translate')('signal_ceo'));
                        break;
                }
            });
        }



        return res.join(', ');
    }
}]);
