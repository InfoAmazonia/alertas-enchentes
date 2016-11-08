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
    'ui.router',
    'openlayers-directive'
  ])
  .constant('RESTAPI', {
    url: 'http://enchentes.infoamazonia.org:8080'
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
    .state('riobranco', {
      url: "/riobranco",
      templateUrl: "views/riobranco.html",
      controller: "RioBrancoCtrl",
      controllerAs: "ctrl"
    })
    .state('portovelho', {
      url: "/portovelho",
      templateUrl: "views/portovelho.html",
      controller: "PortoVelhoCtrl",
      controllerAs: "ctrl"
    })
    .state('manaus', {
      url: "/manaus",
      templateUrl: "views/manaus.html",
      controller: "ManausCtrl",
      controllerAs: "ctrl"
    });
    $urlRouterProvider.otherwise('/');
  }
