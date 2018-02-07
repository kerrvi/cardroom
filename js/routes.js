angular.module('starter.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'registerCtrl'
            })
            // .state('home',{
            //     url: '/home',
            //     templateUrl: 'templates/home.html',
            //     controller: 'HomeCtrl'
            // })
            .state('index',{
                url: '',
                templateUrl: 'index.html',
                controller: 'indexCtrl'
            })
            .state('roomDetail',{
                url: '/roomDetail',
                templateUrl: 'templates/room-detail.html',
                controller: 'roomDetailCtrl'
            })
            .state('roomList',{
                url: '/roomList',
                templateUrl: 'templates/room-list.html',
                controller: 'roomListCtrl'
            })
            .state('myOrder',{
                url: '/myOrder',
                templateUrl: 'templates/my-order.html',
                controller: 'myOrderCtrl'
            })


        ;

        // $urlRouterProvider.otherwise('/home');

    });