/**
 * Created by vovk on 06.09.2016.
 */
var app = angular.module('app');
app.controller('bindMainCtrl', ['$scope', '$state', 'bindHttp', 'baseHttp', '$timeout', '$rootScope', 'localStorageService', '$sce', '$filter', '$mdToast', '$window', '$mdDialog', 'MATERIAL_TYPE', bindMainCtrl]);
function bindMainCtrl($scope, $state, bindHttp, baseHttp, $timeout, $rootScope, localStorageService, $sce, $filter, $mdToast, $window, $mdDialog, MATERIAL_TYPE) {

    $scope.MATERIAL_TYPE = MATERIAL_TYPE;
    $scope.form = {};
    $scope.form_theme = {};
    $scope.arc = localStorageService.get('pm_arc') ? localStorageService.get('pm_arc') : 0;
    $scope.form_test = {};
    $scope.form_author = {};
    $scope.materials = {};
    $scope.defaultLang = [];
    $scope.form_request_copy = {};
    $scope.covers_list = {};
    $scope.current_form = localStorageService.get('pm_public_form');
    $scope.current_direction = localStorageService.get('pm_public_direction');
    $scope.current_spec = localStorageService.get('pm_public_spec');
    $scope.bindActive = localStorageService.get('pm_bindActive');
    $scope.defaultLangForSelect = 'ru'; // выбранный язык по умолчанию
    $scope.defaultLangId = null; // id языка по умолчанию

    // задаем id для выбора языка по умолчанию
    angular.forEach($rootScope.langList, function (val) {
        if (val.short_name === $scope.defaultLangForSelect){
            if($scope.defaultLangId === null){
                $scope.defaultLangId = val.id;
                return;
            }
        }
    });

    angular.forEach($rootScope.langList, function (val) {
        $scope.defaultLang.push(val.id);
    });

    $scope.redirect = function (url, tabs) {
        $state.go(url);
        if (tabs) {
            $scope.bindActive = url;
            localStorageService.set('pm_bindActive', url);
        }
    };

    $scope.getPublicForm = function () {
        bindHttp.getPublicForm().success(function (r) {
            $scope.public_form = r;
        });
    };

    $scope.getPublicSpec = function (form, direction, dontClear) {
        $scope.current_form = form;
        localStorageService.set('pm_public_form', form);
        localStorageService.set('pm_public_direction', direction);
        if (!dontClear) {
            $scope.materials = {};
            $scope.current_spec = '';
            $scope.week_list = {};
        }
        bindHttp.getPublicSpec({form: form, direction: direction, arc: $scope.arc}).success(function (r) {
            $scope.public_spec = r;
        });
    };

    $scope.getPublicDirection = function (form) {
        bindHttp.getAllDirection({form: form}).success(function (r) {
            if (r) {
                $scope.public_direction = r;
            }
        });
    };

    /**
     * Метод для изменения статуса метод пакетов
     * @param arc - статус 1 - удален / 0 - активный
     */
    $scope.changeArc = function (arc) {
        if(!arc){
            $scope.arc = 0;
        }else{
            $scope.arc = arc;
        }
        localStorageService.set('pm_arc', $scope.arc);
        $scope.getPublicSpec($scope.current_form, $scope.current_direction, false);
    };

    $scope.getCountWeek = function (spec) {
        bindHttp.getWeekList({spec: spec}).success(function (r) {
            $scope.week_list = r;
            $scope.count_week = r.length;
        });
    };

    $scope.isAuthorMethod = function () {
        bindHttp.isAuthorMethod({spec: $scope.current_spec}).success(function (r) {
            $scope.isAuthor = r;
        });
    };

    $scope.getTestList = function () {
        bindHttp.getTestList({spec: $scope.current_spec}).success(function (r) {
            $scope.testList = r;
        });
    };

    $scope.getPublicMaterials = function (spec) {
        if (spec) {
            bindHttp.getPublicMaterials({spec: spec}).success(function (r) {
                $scope.getCountWeek(spec);
                $scope.materials = r;
                $scope.current_spec = spec;
                localStorageService.set('pm_public_spec', spec);
                $scope.getAuthorList();
                $scope.isAuthorMethod();
                $scope.getTestList();
                $scope.getCovers(spec);
            });
        }
    };

    $rootScope.getPublicMaterialsOnly = function (spec) {
        if (spec) {
            bindHttp.getPublicMaterials({spec: spec}).success(function (r) {
                $scope.materials = r;
                $scope.current_spec = spec;
            });
        }
    };

    /**
     * Получение обложек для материалов
     * @param idSpec
     */
    $scope.getCovers = function (idSpec) {
        bindHttp.getCovers({id_spec: idSpec}).success(function (r) {
            $scope.covers_list = r;
        });
    };

    $scope.getAuthorList = function () {
        $timeout(function () {
            $scope.$apply();
            bindHttp.getAuthorList({spec: $scope.current_spec}).success(function (r) {
                $scope.authorList = r;
            });
        }, 100);
    };

    $scope.editTheme = function () {
        bindHttp.editTheme($scope.form_theme).success(function (r) {
            $scope.getCountWeek($scope.current_spec);
        });
    };

    $scope.getMaterialsType = function () {
        bindHttp.getMaterialsTypes().success(function (r) {
            $scope.materials_type = r;
        });
    };

    $scope.getCity = function () {
        bindHttp.getCity().success(function (r) {
            $scope.cityList = r;
        });
    };

    $scope.fileName = function (e) {
        $scope.file_hw_filename = e.target.files[0].name;
    };

    $scope.getTeachList = function () {
        bindHttp.getTeachList({city: $scope.form_author.city}).success(function (r) {
            $scope.teachList = r;
        });
    };

    $scope.addAuthor = function () {
        $scope.form_author.spec = $scope.current_spec;
        bindHttp.addAuthor($scope.form_author).success(function (r) {
            if (r.success) {
                $scope.authorList = {};
                $scope.getAuthorList();
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
            } else {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }
        });
    };

    $scope.deleteAuthor = function (id, type) {
        var confirm = $mdDialog.confirm({templateUrl: "views/templates/confirms.html"})
            .title($filter('translate')('delete_author_confirm'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function () {
            $timeout(function () {
                $scope.authorList = {};
                bindHttp.deleteAuthor({id: id, type: type}).success(function (r) {
                    $scope.getAuthorList();
                });
            }, 100);
        });
    };

    $scope.changeAuthorLang = function (id, lang) {
        bindHttp.changeAuthorLang({id: id, lang: lang});
    };

    $scope.sendRequestCopyMethodPackage = function (form) {
        form.id_spec = $scope.current_spec;
        bindHttp.sendRequestCopyMethodPackage(form).success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + $filter('translate')('send_request_copy_success') + '</md-toast>',
                });
                angular.element('#requestCopyMethodpackageModal').closeModal();
            }
        });
    };

    if (angular.isDefined($scope.current_form)) {
        $scope.getPublicSpec($scope.current_form, $scope.current_direction, true);
        $scope.getPublicDirection($scope.current_form);
        if (angular.isDefined($scope.current_spec)) {
            $scope.current_spec = localStorageService.get('pm_public_spec');
            $scope.getPublicMaterials($scope.current_spec);
        }
    }

    $scope.getLink = function (value, type) {
        var matType = parseInt(type);
        if (matType === MATERIAL_TYPE.VIDEO || matType === MATERIAL_TYPE.LABWORK) {
            var text = value;
            var regex = /[?&]v=([-_a-z0-9]{11})/i;
            var code = regex.exec(text);
            if (code) {
                value = 'https://www.youtube.com/embed/' + code[1];
            }
            // Проверяем является ли ссылка плейлистом
            var regex2 = /[?&]list=([-_a-z0-9]{3,})/i;
            var code2 = regex2.exec(text);
            if (code2) {
                value = 'https://www.youtube.com/embed/videoseries?list=' + code2[1];
            }
        } else if (matType === MATERIAL_TYPE.PRESENTATION && value.indexOf('https://www.slideshare.net') < 0) {
            var startPosition = value.indexOf('id=') + 3;
            var endPosition = value.indexOf('&') - startPosition;
            value = 'https://www.slideshare.net/slideshow/embed_code/' + value.substr(startPosition, endPosition);
        }

        return $sce.trustAsResourceUrl(value);
    };

    /**
     * Удаление материалов
     *
     * @param idSpec
     * @param idType
     * @param weekNumber
     * @param idMaterial
     */
    $scope.deleteMaterials = function (idSpec, idType, weekNumber, idMaterial) {
        var successMessage = $filter('translate')('delete_materials_success');
        var errorMessage = $filter('translate')('delete_materials_error');
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        }).title($filter('translate')('delete_material'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function () {
            bindHttp.deleteMaterials({
                week_number: weekNumber,
                type_material: idType,
                id_public_spec: idSpec,
                id_material: idMaterial
            }).success(function (r) {
                if (r.result === true) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast green">' + successMessage +'</md-toast>',
                    });
                    $scope.getPublicMaterials($scope.current_spec);
                } else {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + errorMessage + '</md-toast>',
                    });
                }
            });
        });
    };
}