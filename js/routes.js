angular.module('starter.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('home',{
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
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


        ;

         $urlRouterProvider.otherwise('/home');

    });