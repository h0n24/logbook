var app_module = angular.module('app');

app_module.controller('examsCtrl', ['$scope', 'examsHttp', '$compile', '$sce', '$templateRequest', '$filter', '$rootScope', '$mdToast', 'EXAM_MARKS', 'DIRECTORY_TYPE', 'baseHttp', examsCtrl]);

app.run(function ($rootScope, baseHttp) {
    baseHttp.getArrayMarks().success(function(r){
        $rootScope.arrayMarks = r.reverse();
    });
});

function examsCtrl($scope, examsHttp, $compile, $sce, $templateRequest, $filter, $rootScope, $mdToast, EXAM_MARKS, DIRECTORY_TYPE, baseHttp){
    $scope.serverDate = null;
    $scope.examsMark = [];
    $scope.examsNewMark = {};
    $scope.baseExamsMark = [];
    $scope.EXAM_MARKS = EXAM_MARKS;
    $scope.MAX_FILES_SIZE = 10000000; //максимальный размер загруженных файлов 10MB (пример 155288 - 155 кб )
    $scope.examFile = {}; // эказменационная работа
    $scope.download_url = $rootScope.download_url;
    $scope.commentModel = {}; //комментарий к экзаменационной работе
    $scope.MAX_COMMENT_CHARS = 255; // максимальное количество символов комментария

    /**
     * Прослушка изменений массива оценок, полученных с сервера.
     */
    $rootScope.$watch('arrayMarks', function(newValue, oldValue, scope) {
        if (newValue === oldValue) {return;}
        if(Object.prototype.toString.call(newValue) === '[object Array]'){
            $scope.initMarks();
        }
    });

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    /**
     * Инициализвция оценок для выпадающих списков
     */
    $scope.initMarks = function () {
        $scope.examsMark = [];
        $scope.baseExamsMark = [];
        angular.forEach($rootScope.arrayMarks, function(value, key) {
            $scope.examsMark[key] = value;
        });
        $scope.examsNewMark['-12'] = $filter('translate')('PASS_MARK_EXEM');
        $scope.examsNewMark['-0'] = $filter('translate')('MARK_TYPE_ABSENT'); //для корректной сортировки установлен минусовой индекс
        angular.forEach($scope.examsMark, function(value, key) {
            $scope.examsNewMark[value] = String(value);
        });

        $scope.baseExamsMark = $scope.examsMark.slice();
    };

    $scope.initMarks();

    $scope.activeExam = function(index){
        $scope.current_exam = null;
        $scope.activeTab = index;
    };

    $scope.hideTable = function(){
        $scope.cur_ex_id = !$scope.cur_ex_id;
    };

    $scope.access_marks = [];
    $scope.getExams = function(){
        examsHttp.getExams({}).success(function(r){
            if(r) {
                $scope.current_exams = r[1];
                $scope.old_exams = r[0];
                $scope.future_exams = r[2];
            }
        });
    };

    $scope.getExamDetails = function(exam) {
        for (var i = 0, maxI = $scope.old_exams.length; i < maxI; i += 1){
            if (exam.id != $scope.old_exams[i].id) {
                $scope.old_exams[i].marksTableExist = false;
            }
        }
        for (var i = 0, maxI = $scope.current_exams.length; i < maxI; i += 1){
            if (exam.id != $scope.current_exams[i].id) {
                $scope.current_exams[i].marksTableExist = false;
            }
        }
        for (var i = 0, maxI = $scope.future_exams.length; i < maxI; i += 1){
            if (exam.id != $scope.future_exams[i].id) {
                $scope.future_exams[i].marksTableExist = false;
            }
        }
        if (!exam.marksTableExist){
            $scope.cur_ex_id = exam.id;
            $scope.cur_exam_shor_info = exam;
            $scope.examsMark = $scope.baseExamsMark.slice();
            $scope.fetchExamById(exam.id);
            exam.marksTableExist = true;
        } else {
            $compile($('#marks_block_' + $scope.cur_ex_id).html('').contents())($scope);
            exam.marksTableExist = false;
            $scope.cur_ex_id = false;
        }
    };

    $scope.fetchExamById = function(id) {
        examsHttp.getDetailsExam({id : id}).success(function(r){
            $scope.current_exam = r.exam;
            $scope.access_marks = r.access_mark;
            $scope.serverDate = r.date;
            var marksBlock = $sce.getTrustedResourceUrl('views/templates/templateExams.html');
            $templateRequest(marksBlock).then(function(template) {
                $compile($('#marks_block_' + $scope.cur_ex_id).html(template).contents())($scope);
            }, function() {
                // An error has occurred
            });
        });
    };

    $scope.setMark = function(mark, id_stud, exam_id, date){
        if ($scope.isDisabled(date)) {
            $mdToast.show({
                hideDelay : 4000,
                position : 'top right',
                template : '<md-toast class="md-toast red">' + $filter('translate')('exams_mark_already_exist') + '</md-toast>'
            });
            return;
        }

        if (mark == null) {
            return true;
        }
        examsHttp.setMark({
            mark : mark,
            id_stud : id_stud,
            id : exam_id
        }).success(function(r){
            if(r.error) {
                angular.forEach(r.error, function (value, key) {
                    $mdToast.show({
                        hideDelay : 4000,
                        position : 'top right',
                        template : '<md-toast class="md-toast red">' + value + '</md-toast>'
                    });
                });
            } else if(r.success) {
                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
            }
        });
    };

    $scope.getExams();

    $scope.th_colums = [
        {date: '№'},
        {date: $filter('translate')('group')},
        {date: $filter('translate')('subject')},
        {date: $filter('translate')('date_start')},
        {date: $filter('translate')('date_end')}
    ];

    $scope.public = {showNowMarksForm : true};
    $scope.public = {showFutureMarksForm : true};
    $scope.public = {showPastMarksForm : true};

    $scope.isDisabled = function (date) {
        if (date == null || date == '') {
            return false;
        }
        var nDate = new Date($scope.serverDate);
        var eDate = new Date(date);
        var nDay = new Date(nDate.getFullYear(), nDate.getMonth(), nDate.getDate()).valueOf();
        var eDay = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate()).valueOf();

        return eDay < nDay;
    };

    /**
     *  Добавление файла на сервер
     * @param event
     */
    $scope.addFile = function (event) {
        var targetFile = event.target.files[0];
        if (!targetFile) {
            $mdToast.show({
                hideDelay : 4000,
                position : 'top right',
                template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>'
            });
            return;
        }
        baseHttp.getFileUploadToken().success(function(credentials) {
            if (angular.isDefined(credentials.token)) {
                baseHttp.uploadFile(credentials, targetFile, DIRECTORY_TYPE.EXAM).success(function (rU) {
                    if (angular.isDefined(rU[0].link)) {
                        $scope.examFile = {
                            'idEx' : event.target.dataset.exam,
                            'idStud' : event.target.dataset.stud,
                            'fileName' : rU[0].link,
                            'commentsTeach' : ''
                        };
                        $scope.setExamFile();

                    }else{
                        $mdToast.show({
                            hideDelay : 4000,
                            position : 'top right',
                            template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                        });
                    }
                }).error(function() {
                    $mdToast.show({
                        hideDelay : 4000,
                        position : 'top right',
                        template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                    });
                });
            }
        });
    };

    /**
     *  Загрузка єкзаменационной работы студента
     */
    $scope.setExamFile = function() {
        $scope.mainPromise = examsHttp.sendExamFileStud($scope.examFile);
        $scope.mainPromise.success(function(response){
            if(response.success){
                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast green">' + $filter('translate')('file_upload_success') + '</md-toast>',
                });
                $scope.fetchExamById($scope.cur_ex_id);
            }else {
                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_upload_error') + '</md-toast>',
                });
            }
        });
    };

    /**
     * Удаление файла
     * @param idStud
     * @param $idExamFile
     * @returns {boolean}
     */
    $scope.deleteFileExam = function (idStud, $idExamFile) {
        $scope.mainPromise = examsHttp.deleteExamFileStud({'id_stud' : idStud, 'id_file' : $idExamFile});
        $scope.mainPromise.success(function(response){
            if(response.success){

                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast green">' + $filter('translate')('file_delete_success') + '</md-toast>',
                });
                $scope.fetchExamById($scope.cur_ex_id);
            }else {
                $mdToast.show({
                    hideDelay : 4000,
                    position : 'top right',
                    template : '<md-toast class="md-toast red">' + $filter('translate')('file_delete_error') + '</md-toast>',
                });
            }
        });

        return true;
    };

    /**
     * Открыть поп-ап для редактирования комментария
     * @param stud_id
     * @param comment
     * @param id_file
     */
    $scope.showComment = function(stud_id, comment, id_file) {
        var marksBlock = $sce.getTrustedResourceUrl('views/templates/examComment.html');
        $scope.commentModel = {
            id_stud: stud_id,
            id_file: id_file,
            commentsTeach: comment
        };
        $scope.activeCommentId = stud_id;
        $scope.activeComment = comment;
        $templateRequest(marksBlock).then(function(template) {
            $compile($('.blockExamMark_' + $scope.cur_ex_id + ' #comment_' + id_file).html(template).contents())($scope);
        });
    };

    /**
     * Проверка длины комметария
     * @param comment
     * @returns {*}
     */
    $scope.checkCommentLength = function(comment) {
        return comment.length > $scope.MAX_COMMENT_CHARS ? comment.slice(0, $scope.MAX_COMMENT_CHARS) : comment;
    };

    /**
     * Обновление комментария
     */
    $scope.commentUpdate = function() {
        $scope.mainPromise = examsHttp.commentUpdateFileStud($scope.commentModel);
        $scope.mainPromise.success(function() {
            $mdToast.show({
                hideDelay : 4000,
                position : 'top right',
                template : '<md-toast class="md-toast green">' + $filter('translate')('comment_update_success') + '</md-toast>',
            });
            $scope.commentModel = {};
            $scope.fetchExamById($scope.cur_ex_id);
        }).error(function() {
            $mdToast.show({
                hideDelay : 4000,
                position : 'top right',
                template : '<md-toast class="md-toast red">' + $filter('translate')('comment_update_error') + '</md-toast>',
            });
        });
    };
}