(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('ManausCtrl', ManausCtrl);

  ManausCtrl.$inject = ['$http', '$templateCache', 'RESTAPI'];

  /*jshint latedef: nofunc */
  function ManausCtrl($http, $templateCache, RESTAPI) {
    var vm = this;
    vm.river = {};
    vm.loading = true;

    $http(
      {
        method: 'GET',
        url: RESTAPI.url+'/station/14990000/history',
        cache: $templateCache
      }).then(function(response) {
        vm.loading = false;
        vm.river = response.data;
      });
  }
})();
