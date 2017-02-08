(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .factory('Now', Now);

  Now.$inject = ['RESTAPI','$resource'];

  /*jshint latedef: nofunc */
  function Now(RESTAPI, $resource) {
    return $resource(RESTAPI.url+'/station/:id/now');
  }
})();
