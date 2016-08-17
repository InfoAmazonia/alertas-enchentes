'use strict';

/**
 * @ngdoc function
 * @name alertasEnchentesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the alertasEnchentesApp
 */
angular.module('alertasEnchentesApp')
  .controller('MainCtrl', function () {
    var getConvertedNow = function() {
      var date = new Date();
      var hh = date.getHours();
      var mm = date.getMinutes();

      return " "+hh+":00";
    };
    this.now = getConvertedNow();
  });
