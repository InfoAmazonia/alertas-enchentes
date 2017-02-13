(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('NavbarCtrl', ['$scope', function($scope) {
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
      $scope.toggleMenu = function() {
        $scope.showMenu = !$scope.showMenu;
      }
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
