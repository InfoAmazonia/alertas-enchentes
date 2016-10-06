(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('PortoVelhoCtrl', PortoVelhoCtrl);

  PortoVelhoCtrl.$inject = ['$http', '$templateCache'];

  /*jshint latedef: nofunc */
  function PortoVelhoCtrl($http, $templateCache) {
    var vm = this;
    vm.river = {};

    $http(
      {
        method: 'GET',
        url: RESTAPI.url+'/station/15400000/history',
        cache: $templateCache
      }).then(function(response) {
        vm.river = response.data;
      }, function(response) {
        console.log("Erro");
      });
  }
})();
