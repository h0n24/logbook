/**
 * Created by vovk on 21.10.2016.
 */
var app = angular.module('app');

app.controller('baseCtrl', ['$scope', '$translate', '$rootScope', 'baseHttp', 'localStorageService', '$state', '$mdSidenav', '$mdMenu', '$mdDialog', '$window', '$sce', '$mdToast', baseCtrl]);

function baseCtrl($scope, $translate, $rootScope, baseHttp, localStorageService, $state, $mdSidenav, $mdMenu, $mdDialog, $window, $sce, $mdToast) {

    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.showModal = false;
    $scope.isAdminOrMaster = false;
    $scope.modalAnimate = null;
    $scope.notDoneTask = null;
    //для работы с модальным окном Задачника
    //массив цветовдля индикатора над прогресс-баром
    $scope.indicatorBackground = ['rgba(89,200,0,1)', 'rgba(255,230,1,1)', 'rgba(255,117,1,1)',  'rgba(255,5,1,1)' ];
    //отступ индикатора ДЗ
    $scope.dzIndicatorMargin = 0;
    //отступ индикатора отзывов
    $scope.reviewIndicatorMargin = 0;
    //отступ индикатора потерь
    $scope.losselIndicatorMargin = 0;
    //цвет индикатора ДЗ
    $scope.dzIndicatorBackground = 'rgba(89,200,0,1)';
    //цвет индикатора отзывов
    $scope.reviewIndicatorBackground = 'rgba(89,200,0,1)';
    //цвет индикатора потерь
    $scope.lossesIndicatorBackground = 'rgba(89,200,0,1)';

    $scope.myDateNew = new Date();
    $scope.minDate = new Date(
        $scope.myDateNew.getFullYear(),
        $scope.myDateNew.getMonth(),
        $scope.myDateNew.getDate()
    );
    /**
     * закрытие бокового меню
     */
    $scope.closeSidebar = () => {
        $mdSidenav('left').close();
    };
    /**
     * открытие бокового меню
     */
    $scope.openSidebar = () => {
        //поместил в макрозадачу, чтобы открытие выполнилось после ивента на ссылке
        setTimeout( ()=> {
            $mdSidenav('left').open();
        },50)
    };
    $scope.isOpenLeft = () => {
        return $mdSidenav('left').isOpen()
    };
    function buildToggler(componentId) {
        return function () {
            $mdSidenav(componentId).toggle();
        };
    }

    $scope.getTeach = function () {
        baseHttp.getTeachList().success(function (r) {
            $scope.teach_list = r;
        });
    };

    $scope.changeUser = function (id) {
        $rootScope.clearLocalStorage();
        baseHttp.changeTeach({id_user: id}).success(function () {
            location.reload();
        });
    };

    $scope.changeCity = function (id) {
        let activeNav = localStorageService.get('activeNav');
        // обнуляю локалсторедж , т.к если препод меняет город - пары не отображаются
        // и 500я на сервере
        if (activeNav == 'presents') {
            $rootScope.clearLocalStorage();
            localStorageService.set('activeNav', 'presents');
        }
         location.replace('/auth/change-city?city=' + id);
    };

    $scope.changeLang = function (id) {
        baseHttp.changeLang({id: id}).success(function () {
            location.reload();
        });
    };

    $scope.getBaseConfig = function () {
        baseHttp.getBaseConfig().success(function (r) {
            $rootScope.langList = r.languages;
            $scope.langListFiltered = r.languages.filter(function(item) { // исключаем испанский и казахский языки из списка в меню
                return  item['short_name'] !== 'es' &&
                        item['short_name'] !== 'kz' &&
                        item['short_name'] !== r.current_lang;
            });
            $scope.current_lang = r.current_lang;
            if (r.current_lang) {
                if ($scope.current_lang == 'ua') {
                    $translate.use('uk');
                } else {
                    $translate.use($scope.current_lang);
                }
            } else {
                $translate.use('en');
            }
            $rootScope.dateFormat = r.dateFormat;
            $rootScope.dateFormatShort = r.dateFormatShort;
            $rootScope.timezoneUTC = 'UTC';
            $rootScope.timezoneF = '';
            $rootScope.signalExist = r.signalExist;
            $rootScope.env = r.env;
            $rootScope.upload_url = r.upload_url;
        });
    };

    $scope.showPrerenderedDialog = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            contentElement: '#signalModal',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    /**
     * Модальное окно с заданиями для преподавателя
     * @param ev
     */
    $scope.showTeachingNotifications = function(ev) {
        $mdDialog.show({
            controller: DialogController,
            contentElement: '#teachingNotificationsModal',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
        });
    };

    $scope.hidemyDialog = function () {
        $mdDialog.hide();
    };

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

    $scope.checkIsAdminOrMaster = function (list) {
        if (list.length === 0) {
            $scope.isAdminOrMaster = false;
        }

        for (var i = 0; i < list.length; i++) {
            if (list[i] === '0' || list[i] === '1') {
                $scope.isAdminOrMaster = true;
            } else {
                $scope.isAdminOrMaster = false;
            }
        }
    };

    $rootScope.getCountUnreadNews = function () {
        baseHttp.getCountUnreadNews().success(function (r) {
            $rootScope.count_unread_news = r;
        });
    };

    $rootScope.getCountNewHw = function () {
        baseHttp.getCountNewHw().success(function (r) {
            $rootScope.count_new_hw = r.hm;
            $rootScope.count_new_lw = r.lw;
        });
    };

    /*
     * Запрос на количество студентов попадающи в потенциальные потери
     */
    $rootScope.getCountTrafficStud = function () {
        baseHttp.getCountTrafficStud().success(function (r) {
            $rootScope.count_tr_stud = r.success.length;
        });
    };

    $rootScope.getCountPortfolio = function () {
        baseHttp.getCountPortfolio().success(function (r) {
            $rootScope.count_portfolio_request = r;
        });
    };

    $rootScope.getNewExamsCount = function () {
        baseHttp.getNewExamsCount().success(function (r) {
            $rootScope.count_new_exams = r;
        });
    };

    $scope.isDesign = function () {
        baseHttp.isDesign().success(function (r) {
            $rootScope.is_design = r;
            if (r) {
                $rootScope.getCountPortfolio();
            }
        });
    };

    $rootScope.clearLocalStorage = function () {
        localStorageService.clearAll();
    };

    $scope.setActiveNow = function (id) {
        //помещаю в макрозадачу, чтобы выполнялась после ивентов на родителе

        if ($scope.isOpenLeft()) {
            setTimeout(() =>{
                $scope.closeSidebar();
            })
        } else $scope.closeSidebar();
        
        let activeNavLocalStorage = localStorageService.get('activeNav');

        // не обнуляем локалсторедж если находясь на странице Пристуствующие нажимаем на боковое меню Присутствующие
        if (activeNavLocalStorage == "presents" && id == "presents") {
            $rootScope.getPresentsRootScope();
        } else {
            $scope.activeNav = id;
            $rootScope.clearLocalStorage();
            localStorageService.set('activeNav', id);
        }
    };

    $scope.setActiveNowBinding = function (id) {
        $scope.activeNav = id;
        $rootScope.clearLocalStorage();
        localStorageService.set('activeNav', id);
    };

    //include #dashboard here
    $scope.activeNav = localStorageService.get('activeNav') ? localStorageService.get('activeNav') : '';

    $rootScope.getFileExtensions = function (filename) {
        filename = filename || '';

        return filename.split('.').pop().toLowerCase();
    };

    $rootScope.canUseInFrame = function (filename) {
        var file_ext = $rootScope.getFileExtensions(filename);
        var ext_frame_file = ['pdf'];

        return ext_frame_file.indexOf(file_ext) >= 0;
    };

    $rootScope.isImageHttp = function(filename) {
        if(!filename){
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', filename, false);
        xhr.send(null);

        return xhr.getResponseHeader("Content-type").indexOf("image") !== -1;
    };

    $rootScope.canUseInFrameHttp = function (filename) {
        if(!filename){
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', filename, false);
        xhr.send(null);

        return xhr.getResponseHeader("Content-type").indexOf("pdf") !== -1;
    };

    $rootScope.isImage = function (filename) {
        var file_ext = $rootScope.getFileExtensions(filename);
        var ext_frame_file = ['png', 'jpg'];

        return ext_frame_file.indexOf(file_ext) >= 0;
    };

    $rootScope.redirect = function (url) {
        $state.go(url);
        $scope.bindActive = url;
    };

    $rootScope.clearCache = function () {
        baseHttp.clearCache().success(function (r) {
            if (r.success) {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>'
                });
            } else {
                $mdToast.show({
                    hideDelay: 4000,
                    position: 'top right',
                    template: '<md-toast class="md-toast red">' + r.error + '</md-toast>'
                });
            }
        });
    };

    $rootScope.getApprovedRequest = function () {
        baseHttp.getApprovedRequest().success(function (r) {
            if (r.count_request > 0) {
                $rootScope.countRequestPresents = r.count_request;
            } else {
                $rootScope.countRequestPresents = 0;
            }
        });
    };

    $rootScope.getCountPairs = function () {
        baseHttp.getCountPairs().success(function (r) {
            $rootScope.count_pairs = parseInt(r.count_pairs);
        });
    };

    $rootScope.copyObj = function (source, destination) {
        if (!angular.equals(source, destination)) {
            if (!!destination) {
                angular.copy(source, destination);
            }
            else {
                destination = angular.copy(source);
            }
        }

        return destination;
    };

    $rootScope.getById = function getById(field, id, myArray) {
        if (angular.isDefined(myArray)) {
            return myArray.filter(function (obj) {
                if (obj[field] == id) {
                    return obj;
                }
            })[0];
        }
    };

    $rootScope.getKeyByValue = function getById(field, id, myArray) {
        var result = 0;
        angular.forEach(myArray, function (value, key) {
            if (value[field] == id) {
                result = key;
                return false;
            }
        });

        return result;
    };

    var myWidth = window.innerWidth;

    if (myWidth < 1000) {
        $scope.hideAll = 1;
    }

    /**
     * Запрос на получения данных по невыполненным заданиям
     */
    $scope.notDoneTaskInfo = function () {
        baseHttp.getNotDoneTask().success(function (r) {
            $scope.notDoneTask  = r;
            $scope.setDzProgressBar(r.dzStud.progress_bar);
            $scope.setReviewProgressBar(r.reviewsStud.progress_bar);
            $scope.setLossesProgressBar(r.potentialLosses);
        });
    };

    $scope.getNews = function () {
        baseHttp.getNews().success(function (r) {
            $scope.news_list = r;
            $scope.active_news = $scope.news_list[0];
        });
    };

    $scope.readNews = function (id) {
        baseHttp.readNews({id: id}, {headers: {'show-loader': false}}).success(function (r) {
            if (r) {
                $rootScope.getCountUnreadNews();
            }
        });
    };

    $scope.activeNews = -1;
    $scope.activeNewsNum = -1;

    $scope.setActiveNews = function (news) {
        $scope.readNews(news.id_bbs);
        $scope.active_news = news;
        $scope.activeNewsNum = news.id_bbs;
        if (window.innerWidth < 992) {
            $scope.myStyle = {"fontSize": "30"};
        }
    };

    $scope.renderHtml = function (html_code, img) {
        if (img) {
            html_code = html_code.replace(/<img[^>]*>/g, "");
        }
        return $sce.trustAsHtml(html_code);
    };

    $scope.getDataMenu = function(){
        baseHttp.getDataMenu().success(function (r) {

            $scope.news_list = r.news;
            $scope.active_news = $scope.news_list[0];//

            baseHttp.getCountTrafficStud().success(function (r) {
                $rootScope.count_tr_stud = r.success.length;
            });

            baseHttp.getAvgEvaluationLessonMark().success(function (r) {
                $rootScope.avg_evaluation_lesson_mark = r;
            });

            $rootScope.langList = r.languages;
            $scope.langListFiltered = r.languages.filter(function (item) { // исключаем испанский и казахский языки из списка в меню
                return item['short_name'] !== 'es' &&
                       item['short_name'] !== 'kz' &&
                       item['short_name'] !== r.current_lang;
            });
            $scope.current_lang = r.current_lang;

            if (r.current_lang) {
                if ($scope.current_lang == 'ua') {
                    $translate.use('uk');
                } else {
                    $translate.use($scope.current_lang);
                }
            } else {
                $translate.use('en');
            }
            $rootScope.dateFormat = r.dateFormat;
            $rootScope.dateFormatShort = r.dateFormatShort;
            $rootScope.timezoneUTC = 'UTC';
            $rootScope.timezoneF = '';
            $rootScope.signalExist = r.signalExist;
            $rootScope.env = r.env;
            $rootScope.upload_url = r.upload_url;

            $rootScope.is_design = r.isDesign;//
            $rootScope.getCountPortfolio();//

            $rootScope.count_new_hw = r.homeworks.hm;//
            $rootScope.count_new_lw = r.homeworks.lw;//

            $rootScope.count_new_exams = r.exams;//

            $rootScope.count_pairs = parseInt(r.count_pairs);

            $rootScope.count_unread_news = r.unreadNews;
        });
    };

    /**
     * Расчет уровня Z-index в html
     * Суть чтобы в прогресс баре мы смогли отображать видимым 3 полосы . Чем меньше значение тем выше расположение полосы.
     * И наоборот чем выше тем значение Z-index меньше
     *
     * @param current - текущее значение
     * @param dataValues -  значение всех
     *
     * @return int
     */
    $scope.priorityIndexViews = function(current, dataValues)
    {
        if(dataValues === undefined){
            return 0;
        }
        var result = 0;
        if (dataValues.savedPerc !== undefined && current <= dataValues.savedPerc) {
            result++;
        }
        if (dataValues.notSavedPerc !== undefined &&  current <= dataValues.notSavedPerc) {
            result++;
        }
        if (dataValues.inWorkPerc !== undefined &&  current <= dataValues.inWorkPerc) {
            result++;
        }

        return result;
    };

    /**
     * устанавливает цвет и отступ индикатора на прогресс-баре для домашних заданий
     * @param dzBar
     */
    $scope.setDzProgressBar = function (dzBar) {
        //выбор цвета для индикатора
        $scope.dzIndicatorBackground = $scope.indicatorBackground[dzBar.valueWeight - 1];
        let maxValue = 6;
        let marginValue = 0;
        if (dzBar.factDays > 0 && dzBar.factDays < maxValue) {
            marginValue = (dzBar.factDays /  maxValue) * 100;
        }
        if (dzBar.factDays >= maxValue) {
            marginValue = 100;
        }
        $scope.dzIndicatorMargin = `0 0 7px calc(${marginValue}% - 20px);`; // 20px - половина блока индикатора
    };

    /**
     * устанавливает цвет и отступ индикатора на прогресс-баре для отзывов
     * @param reviewBar
     */
    $scope.setReviewProgressBar = function (reviewBar) {
        $scope.reviewIndicatorBackground = $scope.indicatorBackground[reviewBar.valueWeight - 1];
        let maxValue = 14;
        let marginValue = 0;
        if (reviewBar.factDay > 0 && reviewBar.factDay < maxValue) {
            marginValue = (reviewBar.factDay / maxValue) * 100;
        }
        if (reviewBar.factDay >= maxValue) {
            marginValue = 100;
        }
        $scope.reviewIndicatorMargin = `0 0 7px calc(${marginValue}% - 20px);`;
    };
    /**
     * устанавливает цвет и отступ индикатора на прогресс-баре для потенциальных потер
     * @param losses
     */
    $scope.setLossesProgressBar = function (losses) {
        $scope.lossesIndicatorBackground = $scope.indicatorBackground[losses.progress_bar_result.valueWeight - 1];
        // инвертируем проценты, т.к. 100% у нас слева
        $scope.losselIndicatorMargin = `0 0 7px calc(${100 - losses.workedPercent}% - 20px);`;
    };

    /**
     * Если строка имеет спецсимволы html то этот вызова дает возможность вывести коректный вид строки
     * @param str
     * @returns {*}
     */
    $scope.trustAsHtmlFuncTransform = function (str){
        return $sce.trustAsHtml(str);
    };

    $scope.getDataMenu();
    $scope.notDoneTaskInfo();
}
