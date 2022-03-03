app = angular.module('app');

app.directive("repeatEnd", function(){
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            if (scope.$last) {
                scope.$eval(attrs.repeatEnd);
            }
        }
    };
});

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('ngConfirmClick', [
    function() {
        return {
            priority: 1,
            link: function(scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.ngClick;
                attr.ngClick = "";
                element.bind('click', function(event) {
                    if (window.confirm(msg)) {
                        scope.$eval(clickAction);
                    }
                });
            }
        };
    }
]);

app.filter('htmlDecode', function() {
    function htmlDecode(input) {
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.hasChildNodes() ? e.childNodes[0].nodeValue : null;
    }
    return function(input) {
        return htmlDecode(input);
    };
});

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('app')
        .setStorageType('localStorage')
        .setNotify(true, true);
});

app.directive('loading',   ['$http', '$rootScope', function ($http, $rootScope) {
    return {
        restrict: 'E',
        template:'<div class="loader" ng-show="showEl"><div class="cssload-thecube"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div></div>',
        link: function (scope, elm, attrs) {
            scope.showEl = false;

            scope.globalIsLoading = function () {
                return $rootScope.isLoading;
            };
            scope.isLoading = function () {
                return $http.pendingRequests.filter(function(value){
                    return Object.keys(value.headers).indexOf('show-loader') === -1;
                }).length > 0;
            };
            scope.$watch(scope.globalIsLoading, function (v) {
                scope.toggleEl(v);
            });
            scope.$watch(scope.isLoading, function (v) {
                scope.toggleEl(v);
            });
            scope.toggleEl = function (value) {
                if(value){
                    scope.showEl = true;
                }else{
                    scope.showEl = false;
                }
            };
        }
    };
}]);

app.directive('autoGrow', function() {
    return function(scope, element, attr){
        var minHeight = element[0].offsetHeight,
            paddingLeft = element.css('paddingLeft'),
            paddingRight = element.css('paddingRight');

        var $shadow = angular.element('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
            fontSize: element.css('fontSize'),
            fontFamily: element.css('fontFamily'),
            lineHeight: element.css('lineHeight'),
            resize:     'none'
        });
        angular.element(document.body).append($shadow);

        var update = function() {
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i++) {
                    r += string;
                }
                return r;
            };

            var val = element.val().replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>')
                .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' ' });
            $shadow.html(val);

            element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */, minHeight) + 'px');
        };

        element.bind('keyup keydown keypress change', update);
        update();
    };
});

app.directive('clearFile', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.val(null);
            });
        }
    };
});

app.directive('resize', function ($window) {
    return function (scope) {
        scope.winWidth = $window.innerWidth;
        angular.element($window).bind('resize', function () {
            scope.$apply(function () {
                scope.winWidth = $window.innerWidth;
            });
        });
    };
});

app.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    };
});

app.directive("createGraph", function () {
    return  {
        scope: {
            graph:'=createGraph',
            objectKey:'=objectKey'
        },
        link : function (scope, element, attrs){
             var createGraph = new app.CreateGraph(element[0], scope.graph, scope.objectKey);
        }
    };
});
//получение размеров элемента. Данные можно извлекать из атрибута key. Пример <span class="hw-md_theme" element-size key="contentSize">
app.directive("elementSize", function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.ready(function () {
                var offsetHeight,
                    scrollHeight,
                    offsetWidth,
                    scrollWidth;
                $timeout(function () {
                    offsetHeight  = element[0].offsetHeight;
                    scrollHeight   = element[0].scrollHeight ;
                    offsetWidth  = element[0].offsetWidth;
                    scrollWidth  = element[0].scrollWidth;
                    if (attrs.key) {
                        scope[attrs.key] = {
                            offsetHeight: offsetHeight,
                            scrollHeight: scrollHeight,
                            offsetWidth: offsetWidth,
                            scrollWidth: scrollWidth,
                        };
                        return;
                    }

                    scope.elementSize = {
                        offsetHeight : offsetHeight ,
                        scrollHeight : scrollHeight ,
                        offsetWidth : offsetWidth ,
                        scrollWidth: scrollWidth
                    };
                });
            });
        }
    };
});

/**
 * Дитректива для загрузки файла путем перетаскивания файла.
 * Вешается на контейнер, в которой будут перетягивать файл.
 * fileToUpload - содержит файл, который добавили перетаскиванием.
 * setFile - функция, которая вызывается при получении файла (сам input при перетаскивании на контейнер файла, не отрабабывает
 * событие onchange)
 */
app.directive('fileDropzone', function($parse) {
    return {
        restrict: 'A',
        scope: {
            fileToUpload: "=",
            setFile: "&"
        },
        link: function(scope, element, attrs) {
            //событие при наведении на контейнер
            element.bind('dragover', function (e) {
                if (e != null) {
                    e.preventDefault();
                }
                element.addClass('drop-over');
            });
            // событие при уходе с контейнера
            element.bind('dragleave', function (e) {
                if (e != null) {
                    e.preventDefault();
                }
                element.removeClass('drop-over');
            });
            // событие при отпускании файла над контейнером
            element.bind('drop', function (e) {
                if (e != null) {
                    e.preventDefault();
                }
                let fileObjectsArray = [];
                let data = e.originalEvent.dataTransfer.items;
                for (let i = 0; i < data.length; i += 1) {
                    if (data[i].kind == 'file') {
                        let f = data[i].getAsFile();
                        fileObjectsArray.push(f);
                    }
                }
                if (fileObjectsArray.length > 0) {
                    scope.$apply(function () {
                        scope.fileToUpload = fileObjectsArray[0];
                        scope.setFile({file: scope.fileToUpload});

                    });
                }
            })
        }
    };
});