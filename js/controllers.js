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
        
        $scope.getLocation = function () {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(onSuccess , onError);
            }else{
                alert("您的浏览器不支持使用HTML 5来获取地理位置服务");
            }
//定位数据获取成功响应
            function  onSuccess(position){
                alert('纬度: '          + position.coords.latitude          + '\n' +
                    '经度: '         + position.coords.longitude         + '\n' +
                    '海拔: '          + position.coords.altitude          + '\n' +
                    '水平精度: '          + position.coords.accuracy          + '\n' +
                    '垂直精度: ' + position.coords.altitudeAccura)
            }
//定位数据获取失败响应
            function onError(error) {
                switch(error.code)
                {
                    case error.PERMISSION_DENIED:
                        alert("您拒绝对获取地理位置的请求");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("位置信息是不可用的");
                        break;
                    case error.TIMEOUT:
                        alert("请求您的地理位置超时");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("未知错误");
                        break;
                }
            }
        }

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
