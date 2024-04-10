/**
 * Created by vovk on 28.09.2016.
 */
var app_module = angular.module('app');
app_module.factory('studentsHttp', ['$http', function($http){
    return {
        getGroups        : function (data) {
            return $http.post('/students/get-groups-list', data)
        },
        getStudents      : function(data){
            return $http.post('/students/get-students', data)
        },
        getStudentsShort : function(data){
            return $http.post('/students/get-students-short', data)
        },
        setComments      : function(data){
            return $http.post('/students/set-comment', data)
        },
        getComments      : function(data){
            return $http.post('/students/get-comments', data)
        },
        deleteComment    : function(data){
            return $http.post('/students/delete-comment', data)
        },
        sendMsg          :  function(data){
            return $http.post('/students/send-msg', data)
        },
        getGroupDetails  : function(data){
            return $http.post('/students/group-info', data);
        },
        getVizitInfo     : function(data){
            return $http.post('/students/get-stud-vizit', data);
        },
        getSpecs         : function(data){
            return $http.post('/students/get-specs', data)
        },
        getDetailsStud   : function(data){
            return $http.post('/students/get-details-stud', data)
        },
        /**
         * Сохраняем отзывы о студенте списком
         * @param data
         * @returns {HttpPromise}
         */
        setCommentList : function(data){
            return $http.post('/students/set-comment-list', data);
        },

        /**
         * Получить список отзывов для модалки
         * @param data
         * @returns {*}
         */
        getCommentsList : function(data){
            return $http.post('/teachComment/comments/search', data);
        },

        /**
         * получить доступные формы для фильтра в модальном окне
         * @param data
         * @returns {*}
         */
        getCommentsListForms : function(data){
            return $http.post('/teachComment/comments/study-forms', data);
        },

        /**
         * Получить доступные группы для фильтра в модальном окне
         * @param data - id формы обучения, по которой нужны группы
         * @returns {*}
         */
        getCommentsListGroups : function(data){
            return $http.post('/teachComment/comments/groups', data);
        },

        /**
         * Сохранение отзыва о студенте в модальном окне
         * @param data
         * @returns {*}
         */
        saveComment : function(data){
            return $http.post('/teachComment/comments/save', data);
        },
    };
}]);