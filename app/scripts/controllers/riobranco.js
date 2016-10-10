(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('RioBrancoCtrl', RioBrancoCtrl);

  RioBrancoCtrl.$inject = ['$http', '$templateCache', 'RESTAPI'];

  /*jshint latedef: nofunc */
  function RioBrancoCtrl($http, $templateCache, RESTAPI) {
    var vm = this;
    vm.river = {};

    $http(
      {
        method: 'GET',
        url: RESTAPI.url+'/station/13600002/history',
        cache: $templateCache
      }).then(function(response) {
        vm.river = response.data;
      }, function() {
        console.log("Erro");
      });
  }
})();
