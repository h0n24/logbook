var  app = angular.module('app');

app.controller('homeCtrl', ['$scope', 'homeHttp','$sce', '$rootScope', 'dateService', 'localStorageService', homeController]);

function homeController($scope, homeHttp, $sce, $rootScope, dateService, localStorageService){

    //activeNav
    localStorageService.set('activeNav', 'home');

    //NEWS
    var newsFromHead = angular.element(document.querySelector('body')).scope().news_list;
    $scope.news_list = newsFromHead ? newsFromHead.slice(2, newsFromHead.length - 1) : (function(){
        homeHttp.getNews().success(function(r){
            $scope.news_list = r.slice(2, r.length - 1);
        })
    })();



    //EVENTS
    var thisDate = new Date();
    $scope.curMonth = dateService.getCalendar(thisDate) || [];

    //add event in cell
    $scope.getHomeEvents = function(){
        homeHttp.getHomeEvents().success(function(r){
            $scope.cur_date_tr = r.cur_date_tr.split(', ')[1] + ', ' + r.cur_date_tr.split(', ')[0];
            $scope.daysShort = r.daysShort;
            setEventInCalendar(r.events);
        })
    };
    $scope.getHomeEvents();

    function setEventInCalendar(events) {
        events.forEach(function (elem, i) {
            var eventDate = new Date(elem.date),
                eventMonth = eventDate.getMonth(),
                eventDay = eventDate.getDate();

            var arrayDay = eventDay + dateService.firstDayOfThis(),
                arrayWeek = Math.round(eventDay / 7),
                arrayWeekDay = arrayDay - arrayWeek * 7;

            if (eventMonth === thisDate.getMonth()){
                $scope.curMonth[arrayWeek][arrayWeekDay - 1].event = elem;

                if(!$scope.activeEvent){
                    $scope.activeEvent = elem;
                }
            }
        })
    }

    $scope.SetActiveEvent = function (event) {
        $scope.activeEvent = event;
    };

    //counters
    $scope.getHomeDz = function(){
        homeHttp.getHomeDz().success(function(r){
            $scope.stat = r;
        })
    };

    //значения используются для переводов
    $scope.homeTranslates = {
        home_all: 'home_all',
        home_statistic: 'home_statistic',
        home_checked: 'home_checked',
        home_issued: 'home_issued',
        home_pairs: 'home_pairs',
        home_marks: 'home_marks',
        home_vizit_rates: 'home_vizit_rates',
        home_losses_rates: 'home_losses_rates',
        home_new_dz: 'home_new_dz',
        home_dz: 'home_dz'
    };

    //значения используются для классов
    $scope.homeCss = {
        home_all: 'home_all',
        home_statistic: 'home_statistic',
        home_checked: 'home_checked',
        home_issued: 'home_issued',
        home_pairs: 'home_pairs',
        home_marks: 'home_marks',
        home_vizit_rates: 'home_vizit_rates',
        home_losses_rates: 'home_losses_rates',
        home_new_dz: 'home_new_dz',
        home_dz: 'home_dz'
    };

    //значения используются для ссылок
    $scope.uiSref = {
        home_all: 'home',
        home_statistic: 'home',
        home_checked: 'homeWork',
        home_issued: 'homeWork',
        home_pairs: 'report',
        home_marks: 'home',
        home_vizit_rates: 'groupsPage',
        home_losses_rates: 'home',
        home_new_dz: 'home',
        home_dz: 'home'
    };

    $scope.getHomeDz();
}