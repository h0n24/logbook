/**
 * Created by vovk on 06.10.2016.
 */
app_module = angular.module('app');
app_module.filter('statusVizitView', ['$filter', function($filter) {
    return function (item) {
        if(item && typeof(item) != "undefined" && item != null){

            switch (item){
                case '0':
                    return 'absent';
                    break;
                case '1':
                    return '';
                    break;
                case '2':
                    return 'late';
                    break;
            }
        }
    }
}]);
app_module.filter('linkView', ['$filter', function ($filter) {
    return function (link) {
        if (link.url.match(new RegExp(link.reg)) !== null) {
            return link.url;
        }
        return link.main_url + link.url;
    };
}]);
app_module.filter('imgView', ['$filter', function ($filter) {
    return function (link) {
        var name = link.name.toLowerCase();
        switch (name) {
            case 'vk':
            case 'facebook':
            case 'twitter':
                return name + '.png';
            default:
                return 'default_link.png';
        }
    };
}]);
app_module.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);
