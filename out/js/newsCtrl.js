var  app = angular.module('app');

app.controller('newsCtrl', ['$scope', 'newsHttp','$sce', '$rootScope', newsController]);

function newsController($scope, newsHttp, $sce, $rootScope){

    $scope.getNews = function(){
        newsHttp.getNews().success(function(r){
            $scope.news_list = r;
            $scope.active_news = $scope.news_list[0];
            $scope.getTime();
        })
    }

    $scope.getEvents = function(){
        newsHttp.getEvents().success(function(r){
            $scope.events_list = r;
            $scope.active_event = $scope.events_list[0];
        })
    }

    var myWidth = window.innerWidth;

    $scope.setActiveNews = function(news){
        $scope.active_news = news;
        $scope.readNews(news.id_bbs);
        if(myWidth < 992){
            $scope.activeNews = news.id_bbs;
            $scope.myStyle = {"fontSize":"30"};
        }
    }
    
    $scope.setActiveEvent = function(event){
        $scope.active_event = event;
        $scope.readEvent(event.id);
        if(myWidth < 992){
            $scope.activeEvent = event.id;
            $scope.myStyle = {"fontSize":"30"};
        }
    }

    $scope.renderHtml = function(html_code, img){
        if(img){
            html_code=html_code.replace(/<img[^>]*>/g,"");
        }
        return $sce.trustAsHtml(html_code);
    };

    $scope.readNews = function(id){
        newsHttp.readNews({id : id}).success(function(r){
            if(r){
                $rootScope.getCountUnreadNews();
            }
        })
    }

    $scope.readEvent = function(id){
        newsHttp.readEvent({id : id}).success(function(r){
            if(r){
                $rootScope.getCountUnreadNews();
            }
        })
    }

    $scope.getTime = function () {
        $scope.timeCount = $scope.news_list.length;
        for (var i=0; i < $scope.timeCount; i++) {
            $scope.news_list[i]['timeObj'] = new Date($scope.news_list[i]['time']);
        }
    }

    //$scope.getNews();
    //$scope.getEvents();
}