'use strict';

/**
 * @ngdoc overview
 * @name alertasEnchentesApp
 * @description
 * # alertasEnchentesApp
 *
 * Main module of the application.
 */
angular
  .module('alertasEnchentesApp', [
    'ngAnimate',
    'ngSanitize',
    'ngTouch',
    'ngResource',
    'ui.router',
    'openlayers-directive',
    'daterangepicker',
    '720kb.socialshare',
    'angulartics',
    'angulartics.google.analytics'
  ])
  .constant('RESTAPI', {
    url: 'https://enchentes.infoamazonia.org:8080'
    // url: 'http://localhost:8080'
  })
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  /*jshint latedef: nofunc */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/main.html",
      controller: "MainCtrl",
      controllerAs: "ctrl"
    })
    .state('history', {
      url: "/history/:river",
      templateUrl: "views/history.html",
      controller: "HistoryCtrl",
      controllerAs: "ctrl"
    })
    .state('intro', {
      url: "/intro",
      templateUrl: "views/intro.html"
    })
    .state('opendata', {
      url: "/opendata",
      templateUrl: "views/opendata.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "views/about.html"
    });
    $urlRouterProvider.otherwise('/');
  }
