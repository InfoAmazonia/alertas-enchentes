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
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/riobranco.html'
      })
      .when('/riobranco', {
        templateUrl: 'views/riobranco.html'
      })
      .when('/portovelho', {
        templateUrl: 'views/portovelho.html'
      })
      .when('/manaus', {
        templateUrl: 'views/manaus.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
