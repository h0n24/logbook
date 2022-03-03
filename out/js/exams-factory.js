/**
 * Created by vovk on 14.11.2016.
 */
var app_module = angular.module('app');

app_module.factory('examsHttp', ['$http', function($http){
    return {
        getExams : function(data){
            return $http.post('/exams/get-exams', data);
        },
        getDetailsExam : function(data){
            return $http.post('/exams/get-exam-info', data);
        },
        setMark : function(data){
            return $http.post('/exams/set-mark', data);
        },
        getNewMarks : function(){
            return $http.post('/exams/get-new-marks-selects');
        },
        //Добавление новой экзаменнационной работы
        sendExamFileStud: function (data) {
            return $http.post('/exams/set-exams-files', data);
        },
        //Удаление экзаменнационной работы
        deleteExamFileStud: function (data) {
            return $http.post('/exams/delete-exams-files', data);
        },
        //Обновление комментария экзаменнационной работы
        commentUpdateFileStud: function (data) {
            return $http.post('/exams/update-comments-exams-files', data);
        },
        // поставить оценку за курсовую
        setMarkCourseWork: function (data) {
            return $http.post('/exams/set-mark-course-work', data);
        },
        // получить список курсовых
        getCourseWorks: function(data) {
            return $http.get('/exams/get-course-works', data);
        },
        // Проставить тему курсовой
        setThemeCourseWork: function (data) {
            return $http.post('/exams/set-theme-course-work', data);
        },
    };
}]);