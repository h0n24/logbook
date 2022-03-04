/**
 * Created by vovk on 09.11.2017.
 */
var app_module = angular.module('app');

app_module.controller('dossierCtrl', ['$scope','dossierHttp', dossierCtrl]);

function dossierCtrl($scope, dossierHttp){

    /**
     * Рейтинг видео
     * 1 - хорошо
     * 2 - удовлетворительно
     * 3 - обратить внимание
     * 4 - не удовлетворительно
     * @type {{NOT_SATISFACTORILY: number, TAKE_NOTE: number, GOOD: number, SATISFACTORILY: number}}
     */
    $scope.RATING = {GOOD: 1, SATISFACTORILY: 2, TAKE_NOTE: 3, NOT_SATISFACTORILY: 4};
    $scope.teachProfile = {};
    $scope.singleData   = {};
    $scope.dataGraphics = {};
    $scope.percents     = {};
    // this.getData = function(){
    //     dossierHttp.getSingleData().success(function(r){
    //         if(angular.isDefined(r.data)){
    //             $scope.singleData = r.data;
    //         }
    //     });
    //     dossierHttp.getDataGraphics().success(function(r){
    //         if(angular.isDefined(r.data)){
    //             $scope.dataGraphics = r.data;
    //         }
    //     });
    // }

    this.getData = function(){
        dossierHttp.getAllData().success(function(r, status, headers){
            if(angular.isDefined(r.single_data)){
                $scope.singleData   = r.single_data;
            }
            if(angular.isDefined(r.graphics_data)){
                $scope.dataGraphics = r.graphics_data;
            }
            if(angular.isDefined(r.profile_data)){
                $scope.teachProfile = r.profile_data;
            }
            if(angular.isDefined(r.teach_specs_list)){
                $scope.teachSubjectInfo = r.teach_specs_list;
            }
            if(angular.isDefined(r.percents)){
                $scope.percents = r.percents;
            }
            if (headers()["content-type"].substring(0, 9) === "text/html") {
                history.back();
            }
        });

    }
    //
    // $scope.sortSingleData = function(){
    //     return $scope.singleData.sort(function(a,b) {
    //         return a.order_single - b.order_single;
    //     });
    // };


    /**
     * Запрос на получения списка видео
     */
    $scope.getVideo = function(){
        dossierHttp.getVideo().success(function(r){
            $scope.videoList = r.videoReport;
        });
    };

    /**
     * Запрос на получения статусов видео
     */
    $scope.getStatusNameVideo = function(){
        dossierHttp.getStatusNameVideo().success(function(r){
            $scope.statusListVideo = r.videoStatus;
        });
    };

    /**
     * Цветовая схема рейтинга видео
     * @param idRating
     * @returns {string}
     */
    $scope.colorRating = function(idRating)
    {
        var colorClass = 'video-rating';
        idRating = Number(idRating);

        if(idRating === $scope.RATING.GOOD){
            colorClass = 'video-rating-green';
        }else if(idRating === $scope.RATING.SATISFACTORILY){
            colorClass = 'video-rating-yellow';
        }else if(idRating === $scope.RATING.TAKE_NOTE){
            colorClass = 'video-rating-red';
        }else if(idRating === $scope.RATING.NOT_SATISFACTORILY){
            colorClass = 'video-rating-red';
        }

        return colorClass;
    };

    /**
     * Получаем имя рейтинга видео по id
     * @param idRating
     */
    $scope.statusNameRating = function(idRating)
    {
        if($scope.statusListVideo[idRating]){
            return $scope.statusListVideo[idRating];
        }
        return  '';
    };

    /**
     * Определяме не удовлетворительно видео
     * @param idRating
     * @returns {boolean}
     */
    $scope.satisfactorilyVideo = function(idRating)
    {
        idRating = Number(idRating);

        if(idRating === $scope.RATING.NOT_SATISFACTORILY){
            return true;
        }
        return  false;
    };

    $scope.getStatusNameVideo();
    $scope.getVideo();

}