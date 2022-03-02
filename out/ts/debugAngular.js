// debug tools
export function debugAngular() {
    (function () {
        // @ts-ignore: Not in this file, it's on the website
        var $rootScope = angular.element(document).scope();
        var debug = true;
        function clog(message1, message2, message3) {
            if (debug) {
                console.log(message1, message2, message3);
            }
        }
        $rootScope.kubut = {
            $stateChangeStart: function () { },
            $stateChangeError: function () { },
            $stateChangeSuccess: function () { },
            $viewContentLoaded: function () { },
            $stateNotFound: function () { }
        };
        $rootScope.kubut.$stateChangeStart = $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            clog("$stateChangeStart to " +
                toState.to +
                "- fired when the transition begins. toState,toParams : \n", toState, toParams);
        });
        $rootScope.kubut.$stateChangeError = $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams) {
            clog("$stateChangeError - fired when an error occurs during transition.");
        });
        $rootScope.kubut.$stateChangeSuccess = $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            clog("$stateChangeSuccess to " +
                toState.name +
                "- fired once the state transition is complete.");
        });
        $rootScope.kubut.$viewContentLoaded = $rootScope.$on("$viewContentLoaded", function (event) {
            clog("$viewContentLoaded - fired after dom rendered", event);
        });
        $rootScope.kubut.$stateNotFound = $rootScope.$on("$stateNotFound", function (event, unfoundState, fromState, fromParams) {
            clog("$stateNotFound " +
                unfoundState.to +
                "  - fired when a state cannot be found by its name.");
            clog(unfoundState, fromState, fromParams);
        });
        var css = "font-size: 15px; color: #007EA3; font-weight: bold;";
        clog("%cui router watch has been started", css);
    })();
}
