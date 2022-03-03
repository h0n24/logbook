var app_module = angular.module('app');

app_module.controller('individualCtrl', ['$scope', '$stateParams', 'individualHttp', 'STATUS_VOUCHER', 'STATUS_PAYMENTS', '$mdToast', '$filter', individualCtrl]);

function individualCtrl ($scope, $stateParams, individualHttp, STATUS_VOUCHER, STATUS_PAYMENTS, $mdToast, $filter) {

    /**
     * Данные по ваучеру
     * @type {Array}
     */
    $scope.infoVoucher = [];

    /**
     * Проверяем обработан ли ваучер
     * @returns {boolean}
     */
    $scope.voucherWorker = function(){
        if($scope.infoVoucher.status_voucher === STATUS_VOUCHER.WORKER){
            return true;
        }
        return  false;
    };

    /**
     * Проверяем оплату ваучера
     * @returns {boolean}
     */
    $scope.voucherPayments = function(){
        if($scope.infoVoucher.payments === STATUS_PAYMENTS.SUCCESS){
            return true;
        }
        return  false;
    };

    /**
     * Информация по ваучеру
     */
    $scope.getInfoVoucher = function(){
        individualHttp.getInfoVoucher({identifier : $stateParams.identifier}).success(function(result){
            $scope.infoVoucher = result;
        })
    };

    /**
     * Подтверждение ваучера преподавателем
     * @param ident - идентификатор
     */
    $scope.confirmVoucher =  function(ident){
        individualHttp.confirmTeachVoucher({identifier : ident}).success(function(result){
            if(result == true){
                $scope.getInfoVoucher();

                return true;
            }

            $mdToast.show({
                hideDelay : 4000,
                position : 'top right',
                template : '<md-toast class="md-toast red">' + $filter('translate')('occupation_already_noted_earlier') + '</md-toast>'
            });
        })

        return false;
    };

    /**
     * Вызов методаов при загрузке страницы
     */
    $scope.getInfoVoucher();

};

