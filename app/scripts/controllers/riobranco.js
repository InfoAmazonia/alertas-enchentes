(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('RioBrancoCtrl', RioBrancoCtrl);

  RioBrancoCtrl.$inject = ['$http', '$templateCache', 'RESTAPI'];

  /*jshint latedef: nofunc */
  function RioBrancoCtrl($http, $templateCache, RESTAPI) {
    var vm = this;
    vm.river = {};
    vm.loading = true;

    $http(
      {
        method: 'GET',
        url: RESTAPI.url+'/station/13600010/history',
        cache: $templateCache
      }).then(function(response) {
        vm.loading = false;
        vm.river = response.data;
      });
  }
})();
