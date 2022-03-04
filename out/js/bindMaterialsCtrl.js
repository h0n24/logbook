/**
 * Created by vovk on 06.09.2016.
 */
var app = angular.module('app');
app.controller('bindMaterialsCtrl', [
    '$scope',
    'bindHttp',
    '$timeout',
    'localStorageService',
    '$rootScope',
    '$mdDialog',
    '$filter',
    'baseHttp',
    '$mdToast',
    'MATERIAL_TYPE',
    'DIRECTORY_TYPE',
    bindMaterialsCtrl
]);

function bindMaterialsCtrl($scope, bindHttp, $timeout, localStorageService, $rootScope, $mdDialog, $filter, baseHttp, $mdToast, MATERIAL_TYPE, DIRECTORY_TYPE) {

    $scope.getPublicForm();
    $scope.getCity();

    document.getElementById('psevdoscroll').addEventListener('scroll', function (e) {
        e.target.nextElementSibling.scrollLeft = e.target.scrollLeft;
    });

    document.getElementById('realScroll').addEventListener('scroll', function (e) {
        e.target.previousElementSibling.scrollLeft = e.target.scrollLeft;
    });

    $scope.MATERIAL_TYPE = MATERIAL_TYPE;
    $scope.new_spec_form = {};
    $scope.form_copy_package_week = {};
    $scope.showFrame = false;
    $scope.showImage = false;
    $scope.showFrameImgBook = false;
    $scope.showLinkToFile = false;
    $scope.modalTitle = '';
    $scope.unreadLog = {};
    $scope.form = {type: null, week: null, old_week: null, public_week: null, url: null};
    $scope.actualesMaterialButton = true; //параметр актуализации материала
    $scope.actualesMaterialData = null; //дата при актуализации материала
    $scope.form_cover = {type: null, filename: null, file_url: null, file: null, id_spec: null};
    $scope.imgTypes = ["image/png", "image/jpeg", "image/gif", "image/svg"];
    $scope.fileTypes = ["application/pdf"];

    $scope.openModal = function (type, data, week, theme, title) {
        $scope.form = {type: type, week: parseInt(week), old_week: parseInt(week), public_week: parseInt(week), url: ''};
        $scope.showFrame = false;
        $scope.showFrameImgBook = false;
        $scope.showLinkToFile = false;
        if (data !== null) {
            $scope.form = {...data};
            $scope.form.old_week = week;
        }
        $scope.modalTitle = title;
        $scope.checkShowFrame($scope.form);
        $scope.form.closed = ($scope.form.closed == '0' || !$scope.form.closed) ? false : true; // для чекбокса
    };

    $scope.getMaterialsType = function () {
        bindHttp.getMaterialsTypes({all: 1}).success(function (r) {
             $scope.materials_type = r;
        });
    };

    $scope.showPrerenderedDialog = function (e, mdDialogWin) {

        $mdDialog.show({
            controller: DialogController,
            contentElement: mdDialogWin,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            onRemoving: function () {
                $scope.form = {type: null, url: null};
                $scope.form_cover = {type: null, filename: null, file_url: null, file: null, id_spec: null};
            }
        });
    };

    $scope.hide = function () {
        $mdDialog.hide();
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancelDialog = function () {
            $mdDialog.cancel();
        };

        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }

    /**
     * ПРоверка на показ фрейма
     * @param form
     */
    $scope.checkShowFrame = function (form) {
        if(form){
            var formType = parseInt(form.type);
            $scope.showFrame = ((
                    formType === MATERIAL_TYPE.PRESENTATION ||
                    formType === MATERIAL_TYPE.VIDEO ||
                    formType === MATERIAL_TYPE.POSTS ||
                    formType === MATERIAL_TYPE.LABWORK ||
                    formType === MATERIAL_TYPE.HOMEWORK
                ) && form.url
            );
            if ($scope.showFrame == false) {
                baseHttp.getFileType(form.file_url).then(function (result) {
                    if (result &&  $scope.imgTypes.indexOf(result) > -1) {
                        setTimeout(function () {
                            $scope.showImage = true;
                                $scope.$apply();
                        }, 200);
                    }
                    if (result && $scope.fileTypes.indexOf(result) > -1) {
                        setTimeout(function () {
                            $scope.showFrame = (
                                formType === MATERIAL_TYPE.HOMEWORK ||
                                formType === MATERIAL_TYPE.LESSON ||
                                formType === MATERIAL_TYPE.LABWORK);
                            $scope.$apply();
                        }, 200);
                    }
                });
            }
            baseHttp.isImage(form.file_img_book).then(function (result) {
                setTimeout(function () {
                    $scope.showFrameImgBook = (formType === MATERIAL_TYPE.BOOK && form.file_img_book && result);
                        $scope.$apply();
                }, 200);
            });
            $scope.showLinkToFile = (
                (
                    formType === MATERIAL_TYPE.HOMEWORK ||
                    formType === MATERIAL_TYPE.LESSON ||
                    formType === MATERIAL_TYPE.LABWORK
                ) &&
                form.file_url
            );
        }
    };

    $scope.editMaterials = function () {
        var data = new FormData();
        var formType = parseInt($scope.form.type);
        var fileType = null;
        angular.forEach($scope.form, function (value, key) {
            if(key === 'closed'){
                // для чекбокса
                value = (value == false) ? 0 : 1;
            }
            data.append(key, value);
        });
        data.append('public_spec_id', $scope.current_spec);
        if ((angular.isDefined($scope.form.file) || angular.isDefined($scope.form.file_book)) && (formType !== MATERIAL_TYPE.VIDEO && formType !== MATERIAL_TYPE.PRESENTATION && formType !== MATERIAL_TYPE.POSTS)) {
            //если есть какието файлы отправляем запрос на файловый сервер
            baseHttp.getFileUploadToken().success(function(credentials) {
                if (angular.isDefined(credentials.token)) {
                    // Если поле файл не пустой и это не книга.
                    if (angular.isDefined($scope.form.file) && formType !== MATERIAL_TYPE.BOOK) {
                        fileType = 'filename';
                        baseHttp.uploadFile(credentials, $scope.form.file, DIRECTORY_TYPE.MATERIAL).success(function (rU) {
                            if (angular.isDefined(rU[0].link)) {
                                data.append(fileType, rU[0].link);
                                $scope.baseEditMaterials(data);
                            } else {
                                $mdToast.show({
                                    hideDelay: 4000,
                                    position: 'top right',
                                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>'
                                });
                            }
                        });
                    }
                    // Если поле обложки книги не пустое и тип материала книга.
                    if (angular.isDefined($scope.form.file_book) && formType === MATERIAL_TYPE.BOOK) {
                        fileType = 'img_book';
                        baseHttp.uploadFile(credentials, $scope.form.file_book, DIRECTORY_TYPE.COVER_IMAGE).success(function (rU) {
                            if (angular.isDefined(rU[0].link)) {
                                data.append(fileType, rU[0].link);
                                $scope.baseEditMaterials(data);
                            } else {
                                $mdToast.show({
                                    hideDelay: 4000,
                                    position: 'top right',
                                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>'
                                });
                            }
                        });
                    }
                }
            });
        } else {
            $scope.baseEditMaterials(data);
        }
    };

    $scope.baseEditMaterials = function (data) {
        bindHttp.editMaterials(data).success(function (r) {
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }
            else if (r.success) {
                document.querySelector('[ng-model="file_hw_filename"]').value = "";
                document.querySelector('[ng-model="img_book"]').value = "";
                $scope.form.file_img_book = r.file_img_book;
                $scope.form.closed = r.closed;

                if ((r.id_material && angular.isUndefined($scope.form.public_materials_id) || (r.week != $scope.form.old_week))) {
                    $scope.form.public_materials_id = r.id_material;
                    $scope.form.id = r.id;
                    $scope.form.filename = r.filename;
                    $scope.form.img_book = r.img_book;
                    $scope.form.file_url = r.file_url;
                    $scope.form.file_img_book = r.file_img_book;
                    $scope.form.shared = r.shared;
                    var public_week = $scope.form.public_week
                        ? $scope.form.public_week
                        : ($scope.form.week ? $scope.form.week : r.week);
                    if (angular.isUndefined($scope.materials[public_week])) {
                        $scope.materials[public_week] = {data: {}};
                    }
                    if (angular.isUndefined($scope.materials[public_week].data[$scope.form.type])) {
                        $scope.materials[public_week].data[$scope.form.type] = [];
                    }
                    if (r.week != $scope.form.old_week) {
                        var keyOldObj = $rootScope.getKeyByValue('public_materials_id', r.id_material, $scope.materials[$scope.form.old_week].data[$scope.form.type]);
                        $scope.materials[$scope.form.old_week].data[$scope.form.type].splice(keyOldObj, 1);
                    }
                    $scope.materials[public_week].data[$scope.form.type].push($scope.form);
                }else{
                    $scope.setEditingElement($scope.form, $scope.form.public_materials_id);
                }
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.unreadLog[r.id] = [r.id];
                $scope.hide();
            }
        });
    };

    $scope.deleteMaterial = function (id, type) {
        var objForm = type ? $scope.form_test : $scope.form;
        var typeMaterial = type ? MATERIAL_TYPE.QUIZ : objForm.type;
        var confirm = $mdDialog.confirm({templateUrl: "views/templates/confirms.html"})
            .title($filter('translate')('delete_material'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function () {
            bindHttp.deleteMaterial({id: id, spec: $scope.current_spec}).success(function (r) {
                if (r.success) {
                    var obj = $scope.materials[objForm.week].data[typeMaterial];
                    angular.forEach(obj, function (value, key) {
                        if (parseInt(value.public_materials_id) === parseInt(id)) {
                            obj.splice(key, 1);
                        }
                    });
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                    });
                } else {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                    });
                }
            });
        });
    };

    $scope.addWeek = function () {
        bindHttp.addWeek({spec: $scope.current_spec, count_week: $scope.count_week}).success(function (r) {
            if (r) {
                $scope.getCountWeek($scope.current_spec);
            }
        });
    };

    $scope.openTheme = function (week, theme) {
        $scope.form_theme.theme = theme;
        $scope.form_theme.week = week;
        $scope.form_theme.spec = $scope.current_spec;
    };

    $scope.openModalTest = function (week, edit, data) {
        $scope.form_test = {};
        if (typeof $scope.testList == "undefined") {
            $scope.getTestList();
        }
        $scope.type_test = edit;
        $scope.form_test.week = week;
        if (data) {
            $scope.form_test.id_material = data.public_materials_id;
            $scope.form_test.name_quiz = data.name_quiz;
            $scope.form_test.id_quiz = data.filename;
            $scope.form_test.description = data.description;
            $scope.form_test.theme = data.theme;
        }
    };

    $scope.openModalCover = function (spec, type) {
        $scope.form_cover.id_spec = spec;
        $scope.form_cover.type = type;
        $scope.form_cover.file_url = $scope.covers_list[type];
    };

    $scope.saveTest = function () {
        $scope.form_test.spec = $scope.current_spec;
        $scope.form_test.type = 7;
        bindHttp.saveTest($scope.form_test).success(function (r) {
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            }
            else if (r.success) {
                if (r.id_material && angular.isUndefined($scope.form_test.public_materials_id)) {
                    $scope.form_test.public_materials_id = r.id_material;
                    $scope.form_test.id = r.id;
                    $scope.form_test.theme = r.name_quiz;
                    $scope.form_test.name_quiz = r.name_quiz;
                    $scope.form_test.filename = r.filename;
                    var public_week = $scope.form_test.public_week ? $scope.form_test.public_week : $scope.form_test.week;
                    if (angular.isUndefined($scope.materials[public_week])) {
                        $scope.materials[public_week] = {data: {}};
                    }
                    if (angular.isUndefined($scope.materials[public_week].data[$scope.form_test.type])) {

                        $scope.materials[public_week].data[$scope.form_test.type] = [];
                    }
                    $scope.materials[public_week].data[$scope.form_test.type].push($scope.form_test);
                }
                $scope.form_test = {};
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
            }
        });
    };

    $scope.editSpec = function () {
        var spec = $.grep($scope.public_spec, function (e) {
            return e.id == $scope.current_spec;
        })[0];
        if (spec) {
            $scope.new_spec_form.id_spec = $scope.current_spec;
            $scope.new_spec_form.name_spec = spec.name_spec;
            $scope.new_spec_form.short_name_spec = spec.short_name_spec;
            $scope.new_spec_form.id_direction = '' + spec.id_direction;
            $scope.new_spec_form.id_form = $scope.current_form !== null ? $scope.current_form : spec.id_form;
            $scope.getPublicDirectionEdS($scope.new_spec_form.id_form);
        }
    };

    $scope.copyMethodPackage = function (spec) {
        bindHttp.copyMethodPackage({spec: spec}).success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.getPublicSpec($scope.current_form, null, true);
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

    $scope.addSpec = function (data) {
        bindHttp.addSpec(data).success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.new_spec_form = {};
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

    $scope.getPublicDirectionEdS = function (form) {
        bindHttp.getAllDirection({form: form}).success(function (r) {
            if (r) {
                $scope.EdS_public_direction = r;
            }
        });
    };

    $scope.weakValidation = function (event) {
        var num = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if (num.indexOf(String.fromCharCode(event.keyCode || event.charCode)) === -1) {
            event.preventDefault();
        }
    };

    $scope.deletePackage = function (id) {
        var confirm = $mdDialog.confirm({templateUrl: "views/templates/confirms.html"})
            .title('Удаление методпакета')
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function () {
            bindHttp.deletePackage({spec: id}).success(function (r) {
                if (r.success) {
                    $scope.getPublicSpec($scope.current_form, null, false);
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
        });
    };

    /**
     * Метод для восстановления метод пакетов
     * перевод пакета в активный статус 0
     * @param id - id предмета
     */
    $scope.restorePackage = function (id) {
        var confirm = $mdDialog.confirm({templateUrl: "views/templates/confirms.html"})
            .title($filter('translate')('Restore method package'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));

        $mdDialog.show(confirm).then(function () {
            bindHttp.restorePackage({spec: id}).success(function (r) {
                if (r.success) {
                    $scope.getPublicSpec($scope.current_form, $scope.current_direction, false);
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
        });
    };

    $scope.readMaterialsLogs = function(idLog){
        $scope.actualesMaterialButton = true;
        var idLogNew = false;
        if(idLog.id_bind){
            idLogNew = idLog.id_bind;
        }else if(idLog.id){
            idLogNew = idLog.id;
        }
        if(idLogNew){
            bindHttp.readMaterialsLogs({id_bind : idLogNew}).success(function(r){
                if(r.success){
                    delete $scope.unreadLog[r.success];
                }
            });
        }
    };

    $scope.getUnreadLogs = function(idSpec){
        bindHttp.getUnreadLogs({id_spec : idSpec}).success(function(r){
            if(angular.isDefined(r)){
                $scope.unreadLog = r;
            }
        });
    };

    /**
     *
     * @param data
     * Метод для копирования материалов методпакета выбраной недели/языка/типа в другой пакет(или в этот же на другой язык)
     */
    $scope.copyWeekPackage = function (data) {
        var sendData = {
            package_from : $scope.current_spec,
            week_from : data.week,
            package_to : data.spec,
            week_to :  data.week_to,
            language_to : data.language,
            type : data.type
        };
        bindHttp.copyPackageFromWeek({data : sendData}).success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $rootScope.getPublicMaterialsOnly($scope.current_spec);
            } else {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                });
            }
        });
    };

    /**
     * метод для открытия модалки чтобы скопировать метод пакет на другую неделю/другой язык/другой пакет
     */
    $scope.openCopyWeekPackage = function () {
        bindHttp.getPublicSpec().success(function (r) {
            $scope.form_copy_package_week.spec_list = r;
        });
    };

    /**
     * Получения направлений обученяи для модалки в которой копируются материалы с недели на неделю
     */
    $scope.getPublicDirectionCWP = function (idForm) {
        bindHttp.getAllDirection({form: idForm}).success(function (r) {
            if (r) {
                $scope.form_copy_package_week.direction_list = r;
            }
        });
    };

    /**
     * Получения списка методпакетов для модалки в которой копируются материалы с недели на неделю
     */
    $scope.getPublicSpecCWP = function (idForm, idDirection) {
        bindHttp.getPublicSpec({form: idForm, direction: idDirection}).success(function (r) {
            $scope.form_copy_package_week.spec_list = r;
        })
    };

    /**
     *  Обновление даты актуализации материала
     * @param publicMaterialsId
     */
    $scope.actualeMaterial = function (publicMaterialsId) {
        $scope.actualesMaterialButton = false;
        bindHttp.actualeMaterial({materialsId: publicMaterialsId}).success(function (r) {
            if(r.result != false){
                $scope.actualesMaterialData = r.result;
                $scope.setEditingElement({
                    source_is_actuales_material:1,
                    source_is_old: null,
                    date_actualization: r.result,
                }, publicMaterialsId);
            }
        })
    };

    /**
     *
     * Актуализация материала
     * true - материал актуальный
     * false -материал не актуальный
     * actualesMaterialButton если кликнули на кнопку актализации
     * @param form
     * @returns {*|boolean}
     */
    $scope.existDataActualMaterial = function (form) {
        return (form.date_actualization && form.source_is_actuales_material == '1') || (form.date_actualization == null && !$scope.actualesMaterialButton); // || $scope.actualesMaterialData
    };

    $scope.uploadCover = function (form) {
        baseHttp.getFileUploadToken().success(function(credentials) {
            if (angular.isDefined(credentials.token)) {
                baseHttp.uploadFile(credentials, form.file, DIRECTORY_TYPE.COVER_IMAGE).success(function (rU) {
                    if (angular.isDefined(rU[0].link)) {
                        form.filename = rU[0].link;
                        bindHttp.saveMaterialCover(form).success(function (r) {
                            if (r.success) {
                                $scope.getCovers(form.id_spec);
                                $mdToast.show({
                                    hideDelay: 4000,
                                    position: 'top right',
                                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                                });
                            } else {
                                $mdToast.show({
                                    hideDelay: 4000,
                                    position: 'top right',
                                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>',
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    /**
     * ТОчечно изменяем свойство материала. Материал ищется в последнем блоке который редактировался
     *
     * @param data
     * @param materialId
     */
    $scope.setEditingElement = function (data, materialId) {
        angular.forEach($scope.materials[$scope.form.week].data[$scope.form.type], function (value, keyMaterial) {
             if(value.public_materials_id == materialId){
                 angular.forEach(data, function (value, key) {
                     $scope.materials[$scope.form.week].data[$scope.form.type][keyMaterial][key] = value;
                 });
             }
        });
    };
}