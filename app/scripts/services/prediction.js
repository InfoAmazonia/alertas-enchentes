(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .factory('Prediction', Prediction);

  Prediction.$inject = ['RESTAPI','$resource'];

  /*jshint latedef: nofunc */
  function Prediction(RESTAPI, $resource) {
    return $resource(RESTAPI.url+'/station/:id/prediction');
  }
})();
