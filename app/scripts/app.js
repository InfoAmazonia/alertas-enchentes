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
    'openlayers-directive'
  ])
  .constant('RESTAPI', {
    url: 'https://enchentes.infoamazonia.org:8443'
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
    });
    $urlRouterProvider.otherwise('/');
  }
