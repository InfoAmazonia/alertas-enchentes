(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .filter('aeLevel', aeLevel);

    aeLevel.$inject = [];

    /*jshint latedef: nofunc */
    function aeLevel() {
      return function (input) {
        if (!input) {return;}
        var newInput = (Math.round((input * 0.01) * 100) / 100).toString().replace(".", ",");
        return newInput+"m";
      };
    }
})();
