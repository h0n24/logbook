
app.controller('signalCtrl', ['$scope', '$rootScope', '$mdToast', 'baseHttp', 'signalHttp', 'studentsHttp', 'tasksHttp', '$mdDialog', '$translate', signalCtrl]);

function signalCtrl($scope, $rootScope, $mdToast, baseHttp, signalHttp, studentsHttp, tasksHttp, $mdDialog, $translate) {

    $scope.selected = [];
    $scope.signalComments = [];
    $scope.modalTaskCount = 3;
    $scope.viewNotMaterials = true;
    $scope.model = {myDate: undefined, quickly: 0};


    $scope.getImplementors = function () {
        signalHttp.getImplementors().success(function (r) {
            $scope.imList = r;
        });
    };

    $scope.getProblems = function () {
        signalHttp.getProblems().success(function (r) {
            $scope.problemsList = r;
        });
    };

    $scope.getGroups = function () {
        studentsHttp.getGroups().success(function (r) {
            if (r) {
                $scope.groups = r;
            } else {
                $scope.groups = [];
            }
        })
    };

    $scope.getStudents = function (g) {
        $scope.cGroup = g;
        setTimeout(function () {
            delete $scope.students;
            $scope.$apply();
            studentsHttp.getStudents({group: $scope.cGroup}).success(function (r) {
                $scope.students = r;
            })
        }, 100);
    };

    $scope.getRooms = function () {
        tasksHttp.getRooms().success(function (r) {
            $scope.rooms = r;
        })
    };

    $scope.getSignals = function () {
        var data = {
            status: $scope.statusModel,
            mode: $scope.modeModel
        };
        signalHttp.getSignals(data).success(function (r) {
            $scope.signalsList = r;
        });
    };

    $scope.getCounters = function () {
        signalHttp.getCounters().success(function (r) {
            $rootScope.countSignals = r;
        });
    };

    $scope.setCounters = function (id) {
        var data = {id: id};
        signalHttp.setCounters(data).success(function (r) {
            $scope.getCounters();
        });
    };

    $scope.initVars = function () {
        if ($rootScope.signalExist) {
            $scope.statusModel = 0;
            $scope.modeModel = false;
            $scope.getCounters();
            $scope.getImplementors();
            $scope.getProblems();
            $scope.getGroups();
            $scope.getStudents();
            $scope.getRooms();
            $scope.getSignals();
        }
    };
    $scope.initVars();

    /**
     * Проверка наличия обработанных сигналов
     * @returns {boolean}
     */
    $scope.checkProcessedSignals = function() {
        return $scope.signalsList.some(item => item.status === "3");
    }


    /**
     *  Отображение оповещения о непроверенном сигнале
     */
    $scope.$watch($scope.isLoading, function(value) {
        if (!value && $scope.checkProcessedSignals() && !sessionStorage.getItem('isWarned')) {
            $mdToast.show({
                hideDelay: 8000,
                position: 'top right',
                template: '<md-toast class="md-toast red"><p translate="signal_alert"></p></md-toast>'
            });
            sessionStorage.setItem('isWarned', '1');
        }
    });


    /* ---------------------------------------------------------------------------------------------------------- */

    $scope.clearForm = function () {
        $scope.cProblem = null;
        $scope.cGroup = null;
        $scope.cStudent = null;
        $scope.cRoom = null;
        $scope.model.quickly = 0;
        $scope.cMessage = null;
        $scope.cTheme = null;
        $scope.selected = [];
        delete $scope.model.myDate;
    };

    /**
     * Сохранение выбраных данных по групе в селект
     */
    $scope.getSelectedGroup = function(id){
        if(id == $scope.cGroup){
            return id;
        }

        return null;
    }

    /**
     * Сохранение выбраных данных по студенту в селект
     */
    $scope.getSelectedStud = function(id){
        if(id == $scope.cStudent){
            return id;
        }

        return null;
    }

    /**
     * Сохранение выбраных данных по аудитории в селект
     */
    $scope.getSelectedRoom = function(id){
        if(id == $scope.cRoom){
            return id;
        }

        return null;
    }

    $scope.setRoom = function (room) {
        $scope.cRoom = room;
    }

    $scope.setStud = function (stud) {
        $scope.cStudent = stud;
    }

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item + "");
        if (idx > -1) {
            list.splice(idx, 1);
        }
        else {
            list.push(item + "");
        }
    };

    $scope.exists = function (item, list) {
        return list.indexOf(item + "") > -1;
    };
    $scope.addSignal = function () {

        if($scope.nameProblem == 'problem_with_study_materials'){
            var data = {
                id_problem: $scope.cProblem,
                message: $scope.cMessage,
                name_problem: $scope.nameProblem,
                theme: $scope.cTheme
            };
        }else{
            var data = {
                id_problem: $scope.cProblem,
                id_group: $scope.cGroup,
                id_stud: $scope.cStudent,
                id_room: $scope.cRoom,
                quickly: Number($scope.model.quickly),
                message: $scope.cMessage,
                implementors: $scope.selected,
                name_problem: $scope.nameProblem,
                theme: $scope.cTheme
            };
        }

        if (angular.isDefined($scope.model.myDate)) {
            try{
                var date = $scope.model.myDate.getFullYear() + '-' + ($scope.model.myDate.getMonth() + 1) + '-' + $scope.model.myDate.getDate();
                Object.assign(data, {date_end: date});
            } catch (e) {
                Object.assign(data, {date_end: $scope.model.myDate});
            }
        }
        if ($scope.editMode == true && $scope.editId != null) {
            Object.assign(data, {id: $scope.editId});
        }
        signalHttp.addTask(data).success(function (r) {
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            }
            else if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });

                $scope.cancelEdit();
                $scope.clearForm();
                $scope.getSignals();
            }
        })
    };

    $scope.getComments = function (id) {
        $scope.signalComments = [];
        signalHttp.getComments({id: id}).success(function (r) {
            $scope.signalComments = r;
            $mdDialog.show({
                contentElement: '#signalComments',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        })
    };

    $scope.getMessage = function (message) {
        $scope.signalMessage = message;
        $mdDialog.show({
            contentElement: '#signalMessage',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    $scope.convertDate = function (date) {
        if (date) return new Date(date * 1000);
    };

    $scope.deleteSignal = function (id) {
        signalHttp.deleteTask({
            id: id
        }).success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.getSignals();
            } else if (r.error) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            }
        });
        $scope.cancelEdit();
    };

    $scope.approve = function (id) {
        signalHttp.approveTask({
            id: id
        }).success(function (r) {
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            }
            else if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.setCounters(id);
                $scope.getSignals();
            }
        })
    };

    $scope.toWork = function (id) {
        signalHttp.toWorkTask({
            id: id
        }).success(function (r) {
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay: 4000,
                        position: 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            }
            else if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
                $scope.setCounters(id);
                $scope.getSignals();
            }
        })
    };

    $scope.setCurTaskEdit = function (task) {
        $scope.cProblem = task.id_problem;
        $scope.cGroup = task.id_group;
        $scope.cStudent = task.id_stud;
        $scope.cRoom = task.id_room;
        $scope.model.quickly = (task.quickly === '0') ? false : true;
        $scope.cMessage = task.message;
        $scope.model.myDate = new Date(task.date_end);
        $scope.cTheme = task.theme;

        var re = /\s*,\s*/;
        var arr = task.implementors.split(re);
        $scope.selected = arr;

        $scope.editMode = true;
        $scope.editId = task.id;
    };

    $scope.cancelEdit = function () {
        $scope.clearForm();
        $scope.editMode = false;
        $scope.editId = null;
    };

    $scope.checkProplem = function(name){
        $scope.viewNotMaterials = (name == 'problem_with_study_materials') ?  false : true;
        $scope.nameProblem = name;
    }
}