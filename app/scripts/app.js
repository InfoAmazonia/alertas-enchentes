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
    'ui.router'
  ])
  .constant('RESTAPI', {
    url: 'http://localhost:5003/api'
  })
  .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  /*jshint latedef: nofunc */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/main.html"
    })
    .state('riobranco', {
      url: "/riobranco",
      templateUrl: "views/riobranco.html",
      controller: "RioBrancoCtrl",
      controllerAs: "ctrl"
    })
    .state('portovelho', {
      url: "/portovelho",
      templateUrl: "views/portovelho.html"
    })
    .state('manaus', {
      url: "/manaus",
      templateUrl: "views/manaus.html"
    });
    $urlRouterProvider.otherwise('/');
  }
