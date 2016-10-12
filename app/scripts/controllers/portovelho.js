(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('PortoVelhoCtrl', PortoVelhoCtrl);

  PortoVelhoCtrl.$inject = ['$http', '$templateCache', 'RESTAPI'];

  /*jshint latedef: nofunc */
  function PortoVelhoCtrl($http, $templateCache, RESTAPI) {
    var vm = this;
    vm.river = {};
    vm.loading = true;

    $http(
      {
        method: 'GET',
        url: RESTAPI.url+'/station/15400000/history',
        cache: $templateCache
      }).then(function(response) {
        vm.loading = false;
        vm.river = response.data;
      });
  }
})();
