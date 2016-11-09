(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .factory('History', history);

  history.$inject = ['RESTAPI','$resource'];

  /*jshint latedef: nofunc */
  function history(RESTAPI, $resource) {
    return $resource(RESTAPI.url+'/station/:id/history');
  }
})();
