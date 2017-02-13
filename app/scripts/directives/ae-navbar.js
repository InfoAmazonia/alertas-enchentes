(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .controller('NavbarCtrl', ['$scope', function($scope) {
      $scope.showMenu = false;
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
