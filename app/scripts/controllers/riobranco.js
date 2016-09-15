(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('RioBrancoCtrl', RioBrancoCtrl);

  RioBrancoCtrl.$inject = [];

  /*jshint latedef: nofunc */
  function RioBrancoCtrl() {
    var vm = this;
    vm.river = "Rio Branco";
    vm.history = [
      {"date": "Jan 2000", "price": "1200"},
      {"date": "Fev 2000", "price": "1300.46"},
      {"date": "Mar 2000", "price": "1400.46"},
      {"date": "Abr 2000", "price": "1500.46"},
      {"date": "Mai 2000", "price": "1320.46"},
      {"date": "Jun 2000", "price": "1394.46"}];
  }
})();
