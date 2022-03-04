var app = angular.module('app');

app.controller('portfolioCtrl', ['$scope', 'portfolioHttp', '$mdDialog', '$rootScope', 'ACHIEVES', 'ACHIEVE_TYPES', '$filter', '$mdToast', 'baseHttp', 'DIRECTORY_TYPE', '$sce', portfolioCtrl]);

function portfolioCtrl($scope, portfolioHttp, $mdDialog, $rootScope, ACHIEVES, ACHIEVE_TYPES, $filter, $mdToast, baseHttp, DIRECTORY_TYPE, $sce){

    $scope.show = false;
    $scope.form_load_new = {};
    $scope.form_load_old = {};
    $scope.form_request  = {};
    $scope.active_url = {};
    $scope.showFrameImgBook = false;

    $scope.file_name = $filter('translate')('select_file');

    $scope.fileName = function(e){
        $scope.file_name = e.target.files[0].name;
    };

    portfolioHttp.achieveInfo({params:{id: ACHIEVES.WORK_IN_PORTFOLIO, type: ACHIEVE_TYPES.EVENT}}).success(function(response){
        $scope.portfolioAchieve = response;
    });

    $scope.getGroups = function(){
        portfolioHttp.getGroups().success(function(r){
            if(angular.isObject(r)) {
                $scope.groups_design = r;
            }else{
                $scope.groups_design = {};
            }
        });
    };

    $scope.changeGroup = function(group, old){
        $scope.getSpec(group, old);
        $scope.getStuds(group, old);
    };

    $scope.getSpec = function(group, old){
        portfolioHttp.getSpec({group : group}).success(function(r){
            if(!old) {
                $scope.spec_design = r;
            }else{
                $scope.spec_design_old = r;
            }
        });
    };

    $scope.getStuds = function(group, old){
        portfolioHttp.getStuds({group : group}).success(function(r){
            if(angular.isObject(r)) {
                if(!old) {
                    $scope.studs = r;
                }else{
                    $scope.studs_old = r;
                }
            }else{
                $scope.studs = {};
            }
        });
    };

    $scope.addToPortfolio = function(obj){
        baseHttp.getFileUploadToken().success(function(credentials) {
            if (angular.isDefined(credentials.token)) {
                baseHttp.uploadFile(credentials, obj.file, DIRECTORY_TYPE.PORTFOLIO).success(function (rU) {
                    if (angular.isDefined(rU[0].link)) {
                        delete obj.file;
                        obj.file_name = rU[0].link;
                        portfolioHttp.addToPortfolio(obj).success(function(r){
                            if(r.error) {
                                angular.forEach(r.error, function (value, key) {
                                    $mdToast.show({
                                        hideDelay : 4000,
                                        position : 'top right',
                                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                                    });
                                });
                            }else {
                                $mdToast.show({
                                    hideDelay : 4000,
                                    position : 'top right',
                                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                                });
                                $scope.form_load_new = {};
                            }
                        });
                    }
                });
            }
        });
    };

    $scope.getHistory = function(){
        portfolioHttp.getHistory().success(function(r){
            if(r){
                $scope.history_list = r;
            }
        });
    };

    $scope.getHomeworkList = function(stud, spec){
        if(angular.isDefined(stud)) {
            portfolioHttp.getHomeworkList({stud: stud, spec: spec}).success(function (r) {
                if (angular.isObject(r)) {
                    $scope.homeworksImage = r;
                }
            });
        }
    };

    $scope.getStudRequest = function(){
        portfolioHttp.getStudRequest().success(function(r){
            if(angular.isDefined(r)) {
                $scope.stud_request = r;
            }
        });
    };

    $scope.getStudRequest();

    $scope.details_portfolio={};
    $scope.showPrerenderedDialog = function(e, mdDialogWin, obj) {
        $scope.showThis = this.$index;
        $scope.details_portfolio = obj;
        $mdDialog.show({
            controller: DialogController,
            contentElement: mdDialogWin,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    $scope.showApproveRequestDialog = function(mdDialogWin, obj, status) {
        $scope.form_request.id = obj.id;
        $scope.form_request.status = status;
        $mdDialog.show({
            controller: DialogController,
            contentElement: mdDialogWin,
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
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

    $scope.approveRequest = function(data){
        portfolioHttp.approveRequest(data).success(function(r){
            if (r.error) {
                angular.forEach(r.error, function (value, key) {
                    // Materialize.toast(value, 4000, 'red');
                    $mdToast.show({
                        hideDelay   : 4000,
                        position    : 'top right',
                        template: '<md-toast class="md-toast red">' + value + '</md-toast>',
                    });
                });
            } else {
                // Materialize.toast(r.success, 4000, 'green');
                $mdToast.show({
                    hideDelay   : 4000,
                    position    : 'top right',
                    template: '<md-toast class="md-toast green">' + r.success + '</md-toast>',
                });
                $scope.getStudRequest();
                $scope.form_request = {};
                $rootScope.count_portfolio_request--;
            }
        });
    };

    $scope.closeModal = function(){
        angular.element('#approveModal').hide();
    };

    $scope.openModal = function(id, status){
        $scope.form_request.id = id;
        $scope.form_request.status = status;
    };

    $scope.deleteWork = function(id, index){
        var confirm = $mdDialog.confirm({
            templateUrl: "views/templates/confirms.html"
        })
            .title($filter('translate')('confirm_delete_from_portfolio'))
            .ok($filter('translate')('ok'))
            .cancel($filter('translate')('cancel'));
        $mdDialog.show(confirm).then(function() {
            portfolioHttp.deleteWork({id : id}).success(function(){
                angular.forEach($scope.history_list, function(value, key){
                    if(value.id == id){
                        $scope.history_list.splice(key, 1)
                    }
                });
            });
        });
    };

    $scope.imageClick = function(item, event){
        if( $scope.form_load_old.id_domzad !== item.id_domzadstud && event) {
            $scope.form_load_old.id_domzad = item.id_domzadstud;
            $scope.form_load_old.url_file = item.real_file_path;
        } else{
            $scope.form_load_old.id_domzad = null;
            $scope.form_load_old.url_file = null;
        }
    };

    $scope.setActiveUrl = function(url){
        baseHttp.isImage(url).then(function (result) {
            setTimeout(function () {
                $scope.showFrameImgBook =  result;
                $scope.$apply();
            }, 200);
        });
        $scope.active_url.url = $sce.trustAsResourceUrl(url);
        $mdDialog.show({
            controller: DialogController,
            contentElement: '#imgModal',
            parent: angular.element(document.body),
            clickOutsideToClose: true
        });
    };

    $scope.getGroups();
    $scope.getHistory();
}
