var app = angular.module('app');
app.controller('tasksCtrl', ['$scope', '$rootScope', 'tasksHttp', '$filter', '$mdDialog', '$mdToast', 'localStorageService', '$sce', tasksCtrl]);


function tasksCtrl($scope, $rootScope, tasksHttp, $filter, $mdDialog, $mdToast, localStorageService, $sce) {

    $scope.task_type = 0;
    $scope.task      = {};
    $scope.signals = angular.element(document.getElementById('signalExist')).scope();

    $scope.initVars = function () {
        var type = localStorageService.get('task_type');
        if (type) {
            $scope.task_type = type;
        }
    };
    $scope.initVars();

    // для отображения переноса строк
    $scope.addTextWrap = function(text) {
        return text.replace(/\n/gi, '<br>');
    };
    
    $scope.models_comment = {};
    $scope.newTask = {};
    $scope.getTasks = function(){
        tasksHttp.getAllTasks().success(function(r){
            $scope.admin_tasks  = r.admin_tasks;
            $scope.zavhoz_tasks = r.zavhoz_tasks;
        });
    };


    $scope.myDate = new Date();

    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getMonth(),
        $scope.myDate.getDate());

    $scope.showPrerenderedDialog = function(e, mdDialogWin) {

        $mdDialog.show({
            controller: DialogController,
            contentElement: mdDialogWin,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
        $scope.newTask = {};
        $scope.newTask.end_date = new Date();
    };
    $scope.hide = function () {
        $mdDialog.hide();
    };
    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancelDialog = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    $scope.setType = function(type){
        $scope.task_type = type;
        localStorageService.set('task_type', type);
        delete $scope.task;
        delete $scope.showAddTask;
        delete $scope.cur_task_edit;
        delete $scope.cur_task_comment;
        $scope.newTask = {};
    }

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    $scope.setCurTaskComment = function(task){
        $scope.cur_task_comment = task;
        $scope.getComments(task.id_w, $scope.task_type);
        $scope.showPrerenderedDialog('', '#cur_task_comment');
    }

    $scope.setCurTaskEdit = function(task){

        $scope.cur_task_edit = angular.copy(task);
        $scope.showPrerenderedDialog('', '#cur_task_edit');
    };

    $scope.unsetCurTask = function(name){
        delete $scope.newTask;
        delete $scope.cur_task_edit;
        delete $scope[name];
    }

    $scope.editTask = function(id, descr, type){
        tasksHttp.editTask({
            id    : id,
            descr : descr,
            type  : type
        }).success(function(r){
            $scope.getTasks();
            $scope.hide();
        })
    }

    $scope.addComment = function(id, descr){
        tasksHttp.addComment({
            id    : id,
            descr : descr,
            type  : $scope.task_type
        }).success(function(r){
            if(r.error) {
                angular.forEach(r.error, function (value, key) {
                    // Materialize.toast(value, 4000, 'red');
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            }
            else if(r.success) {
                // Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.models_comment={};
                $scope.getComments(id, $scope.task_type);
                return true;
            }
        })
    }

    $scope.getRooms = function(){
        tasksHttp.getRooms().success(function(r){
           $scope.rooms = r;
        })
    };

    $scope.getComments = function(id, type){
        tasksHttp.getComments({
            id : id,
            type : type
        }).success(function(r){
            $scope.task_comments = r;
        })
    }

    $scope.addTask = function(task){
        if(typeof task != 'undefined'){
            task.type = $scope.task_type;
        }
        tasksHttp.addTask(task).success(function(r){
            if(r.error) {
                angular.forEach(r.error, function (value, key) {
                    // Materialize.toast(value, 4000, 'red');
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            }
            else if(r.success) {
                // Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.unsetCurTask('showAddTask');
                $scope.getTasks();
                $scope.newTask = {};
                $scope.hide();
            }
        })
    }

    $scope.setStatusTask = function(id, status){
        tasksHttp.setStatusTask({
            id     : id,
            status : status,
            type   : $scope.task_type
        }).success(function(r){
            if(r){
                $scope.getTasks();
            }
        })
    }

    $scope.deleteTask = function(id){
        tasksHttp.deleteTask({
            id : id, type : $scope.task_type
        }).success(function(r){
            if(r.success){
                // Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                delete $scope.cur_task_comment;
                delete $scope.cur_task_edit;
                $scope.getTasks();
            }else if(r.error){
                // Materialize.toast(r.error, 4000, 'red');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            }
        });
    }

    $scope.getTasks();
    $scope.getRooms();

    $scope.newTask.end_date = new Date();

    //$scope.minDate = new Date(
    //    $scope.myDate.getFullYear(),
    //    $scope.myDate.getMonth() - 2,
    //    $scope.myDate.getDate());
    //
    //$scope.maxDate = new Date(
    //    $scope.myDate.getFullYear(),
    //    $scope.myDate.getMonth() + 2,
    //    $scope.myDate.getDate());

    $scope.onlyWeekendsPredicate = function(date) {
        var day = date.getDay();
        return day === 0 || day === 6;
    };

    $scope.th_colums = [
        {title: $filter('translate')('task')},
        {title: $filter('translate')('direction')},
        {title: $filter('translate')('date_of_issue')},
        {title: $filter('translate')('date_end')},
        {title: $filter('translate')('room')},
        {title: $filter('translate')('administrator')},
        {title: $filter('translate')('control')}
        // {title: $filter('translate')('status')}
    ];
    $scope.public = {showAdminEditTask : false};
    $scope.public = {showZavhozEditTask : false};
    //$scope.public - {taskDone : 1}

};