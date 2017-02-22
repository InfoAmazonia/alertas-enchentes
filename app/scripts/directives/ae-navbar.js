(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('NavbarCtrl', ['$scope', '$location', function($scope, $location) {
      $scope.showMenu = false;
      $scope.rivers = [
        {
          slug: 'rioacre',
          name: 'Rio Acre',
          city: 'Rio Branco',
          station: 13600002
        },
        {
          slug: 'riomadeira',
          name: 'Rio Madeira',
          city: 'Porto Velho',
          station: 15400000
        },
        {
          slug: 'manaus',
          name: 'Rio Negro',
          city: 'Manaus',
          station: 14990000
        }
      ];
      $scope.selectedRiver = $scope.rivers[0];
      $scope.share = {}
      $scope.prepareShare = function() {
        $scope.share = {
          title: "InfoAmazonia | Alerta de enchentes",
          text: "Veja as previsões de volume para os rios da região amazônica",
          url: $location.absUrl(),
          appID: "288267271567155"
        }
      }
      $scope.toggleMenu = function() {
        $scope.showMenu = !$scope.showMenu;
      }

      function init() {
        $scope.toggleMenu();
        $scope.showMenu = false;
      }
      init();
    }])
    .directive('aeNavbar', aeNavbar);

    aeNavbar.$inject = [];

    /*jshint latedef: nofunc */
    function aeNavbar() {
      return {
        templateUrl: "views/directives/ae-navbar.html",
        restrict: 'E'
      }
    }

})();
