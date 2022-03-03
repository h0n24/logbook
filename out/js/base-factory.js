/**
 * Created by vovk on 18.10.2016.
 */
var app = angular.module('app');

app.factory('baseHttp', ['$http', function($http){
    return {
        getTeachList : function(){
            return $http.post('/auth/get-teach-list');
        },
        changeTeach  : function(data){
            return $http.post('/auth/change-user', data);
        },
        changeLang : function(data){
            return $http.post('/auth/change-lang', data);
        },
        getBaseConfig    : function(){
            return $http.post('/auth/get-base-config');
        },
        getArrayMarks : function(){
            return $http.post('/auth/get-marks-selects');
        },
        getCountUnreadNews : function(data){
            return $http.post('/counters/get-unread-news', data);
        },
        getCountNewHw : function(data){
            return $http.post('/counters/get-count-new-homeworks', data);
        },
        getCountTrafficStud : function(data){
            return $http.post('/traffic/get-students-active-requests-comment', data);
        },
        isDesign : function(data){
            return $http.post('/auth/is-design', data);
        },
        getCountPortfolio : function(data){
            return $http.post('/counters/count-portfolio-request', data);
        },
        getNewExamsCount : function(data){
            return $http.post('/counters/count-new-exams', data);
        },
        clearCache : function(data){
           return $http.post('/counters/clear-cache', data);
        },
        getApprovedRequest : function(data){
            return $http.post('/counters/get-approved-request', data);
        },
        getCountPairs : function(data){
            return $http.post('/counters/get-count-pairs', data);
        },
        isNewFile : function(fileName) {
            let url;
            try {
                url = new URL(fileName);
            } catch (_) {
                return false;
            }

            return url.protocol === "http:" || url.protocol === "https:";
        },
        getFileUploadToken : function(data){
            return $http.post('/auth/file-token', data);
        },
        uploadFile : function(credentials, file, directory, filename){
            let params = new FormData();
            let directoryRequest = credentials.dir[directory].src;
            params.append('directory', directoryRequest);
            if(!filename){
                params.append('files[]', file);
            }else{
                params.append('files[]', file, filename);
            }
            return  $http({
                method  : 'POST',
                transformRequest: angular.identity,
                url : credentials.url + '/api/v1/files',
                data : params,
                headers : {'Content-Type': undefined, 'Authorization' : 'Bearer ' + credentials.token}
            });
        },
        /**
         * Скачивание дз со старого файлового, для отправки на новый при копировании из рекомендуемых.
         * @param url - Полный url (download_url)
         * @returns {Promise<Blob>}
         */
        getLegacyFile : function(url){
            return new Promise(function(resolve, reject){
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onerror  = function() {
                    reject('Error while file downloading');
                };
                request.onload = function() {
                    if (this.status === 200) {
                        resolve(this.response);
                    } else if (request.status === 404) {
                        reject('Error while file downloading');
                    }
                };
                request.send();
            });
        },
        isImage : function(url) {
            return new Promise(function(resolve, reject){

                if(!url){
                    resolve(false);
                    return;
                }
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onerror  = function() {
                    reject('Error while file downloading');
                };
                request.onload = function() {
                    if (this.status === 200) {
                        let allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/svg"];
                        resolve(this.response && allowedFileTypes.indexOf(this.response.type) > -1);
                    } else if (request.status === 404) {
                        resolve(false);
                    }
                };
                request.send();
            });
        },//application/pdf
        canUseInFrame : function (url) {
            return new Promise(function(resolve, reject){
                if(!url){
                    resolve(false);
                    return;
                }
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onerror  = function() {
                    reject('Error while file downloading');
                };
                request.onload = function() {
                    if (this.status === 200) {
                        let allowedFileTypes = ["application/pdf"];
                        resolve(this.response && allowedFileTypes.indexOf(this.response.type) > -1);
                    } else if (request.status === 404) {
                        resolve(false);
                    }
                };
                request.send();
            });
        },
        getFileType : function (url) {
            return new Promise(function(resolve, reject){
                if(!url){
                    resolve(false);
                    return;
                }
                let request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'blob';
                request.onerror  = function() {
                    reject('Error while file downloading');
                };
                request.onload = function() {
                    if (this.status === 200) {
                        resolve(this.response && this.response.type);
                    } else if (request.status === 404 || request.status === 410) {
                        resolve(false);
                    }
                };
                request.send();
            });
        },
        getNews : function(data){
            return $http.post('/news/get-news', data);
        },
        readNews : function(data, header){
            return $http.post('/news/read-news', data, header);
        },
        getDataMenu : function(data){
            return $http.post('/auth/get-start-info', data);
        },
        /**
         * Запрос на получения данных по невыполненных заданиях преподавателя
         * @param data
         * @returns {HttpPromise}
         */
        getNotDoneTask : function(data){
            return $http.post('/tasks/not-done-tasks', data);
        },
        /**
         * Запрос на получение средней оценки преподавателя
         * @returns {HttpPromise}
         */
        getAvgEvaluationLessonMark : function(){
            return $http.get('/counters/get-avg-evaluation-lesson');
        },
    };
}]);
