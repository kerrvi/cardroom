angular.module('starter.controllers', [])
    .controller('indexCtrl', function ($scope, $state, $ionicLoading, $ionicHistory,$ionicSideMenuDelegate, Utils, Login) {

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

        $scope.login = function () {
            $state.go('login');
        }

        $scope.myOrder = function () {
            $state.go('myOrder');
        }


        $scope.detail = function () {
            $state.go('roomDetail');
        }

        $scope.toggleLeftSideMenu = function() {
            $ionicSideMenuDelegate.toggleRight();
        };

    })

    .controller('LoginCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, Login) {

        $scope.data = {
            loginCode: 'admin',
            loginPwd: '1',
        };

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

        $scope.zhuce = function () {
            $state.go('register');
        }

        $scope.login = function () {
            $state.go('index');
            // Login.login($scope.data.loginCode, $scope.data.loginPwd)
            // .then(function (data) {
            //     $state.go('desktop');
            // }, function (message) {
            //     $ionicLoading.show({ template: '注册失败，' + message, noBackdrop: true, duration: 2000 });
            // });
        };

    $scope.$on("$ionicView.beforeEnter", function () {
        // $ionicHistory.clearHistory();
    });

})

    .controller('registerCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, Login) {

        $scope.data = {
            loginCode: 'admin',
            loginPwd: '1',
        };

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

    })

    .controller('roomDetailCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, Utils, Login) {

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

        $scope.roomOrder = function () {
            $state.go('roomList');
        };

    })

    .controller('roomListCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, Utils, Login) {
        $scope.data = {
            date:new Date(),
            default:true
        }

        $scope.dateShow = function () {
            $scope.data.default = !$scope.data.default;
            // $ionicLoading.show({template:$scope.data.date.toDateString(),duration:1000});
        };

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

    })

    .controller('myOrderCtrl', function ($scope, $state, $ionicLoading, $ionicHistory, Utils, Login) {
        $scope.data = {
            date:new Date(),
            default:true
        }

        $scope.goBack = function () {
            if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            } else {
                $state.go('index');
            }
        };

    })


;
