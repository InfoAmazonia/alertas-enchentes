(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .directive('aeNavbar', aeNavbar);

    aeNavbar.$inject = ['$window'];

    /*jshint latedef: nofunc */
    function aeNavbar($window) {
      return {
        templateUrl: "views/directives/ae-navbar.html",
        restrict: 'E',
        scope: {
          scroll: '=scrollPosition'
        },
        link: function(scope, element, attrs) {
          var windowEl = angular.element($window);
          var handler = function() {
            scope.scroll = windowEl.scrollTop();
          }
          windowEl.on('scroll', scope.$apply.bind(scope, handler));
          handler();
        }
      }
    }

})();
