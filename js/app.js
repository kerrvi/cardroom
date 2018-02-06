// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.routes'])

.run(function ($ionicPlatform, $ionicPopup, DaemonService) {
    
    DaemonService.init();

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    //主页面显示退出提示框  
    $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();

        function showConfirm() {
            $ionicPopup.confirm({
                title: '<strong>退出应用?</strong>',
                template: '<div class="padding">你确定要退出应用吗?</div>',
                okText: '退出',
                cancelText: '取消'
            })
            .then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                } else {
                    // Don't close  
                }
            });
        }

        var path = $location.path();
        if (path == '/tab/message' || path == '/tab/friends' || path == '/tab/setting') {
            showConfirm();
        } else if ($ionicHistory.backView()) {
            $ionicHistory.goBack();
        } else {
            showConfirm();
        }

        return false;
    }, 101);

})

.config(['$ionicConfigProvider', '$provide', function ($ionicConfigProvider, $provide) {

    //解决IE重复点击ngClick事件，多次触发问题
    if (ionic.Platform.ua.toLowerCase().indexOf('trident') > -1) {
        $provide.decorator('ngClickDirective', ['$delegate', '$timeout', function ($delegate, $timeout) {
            var original = $delegate[0].compile;
            var delay = 500;
            $delegate[0].compile = function (element, attrs, transclude) {

                var disabled = false;
                function onClick(evt) {
                    if (disabled) {
                        evt.preventDefault();
                        evt.stopImmediatePropagation();
                    } else {
                        disabled = true;
                        $timeout(function () { disabled = false; }, delay, false);
                    }
                }
                //   scope.$on('$destroy', function () { iElement.off('click', onClick); });
                element.on('click', onClick);

                return original(element, attrs, transclude);
            };
            return $delegate;
        }]);
    }

}])

;