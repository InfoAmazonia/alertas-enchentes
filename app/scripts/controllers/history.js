(function() {
'use strict';

  angular.module('alertasEnchentesApp')
    .controller('HistoryCtrl', HistoryCtrl);

  HistoryCtrl.$inject = ['$scope', '$window', '$stateParams', 'History'];

  function HistoryCtrl($scope, $window, $stateParams, History) {
    var vm = this;
    vm.loading = true;
    vm.rivers = [
      {
        slug: 'rioacre',
        name: 'Rio Acre',
        station: 13600002,
        history: {}
      },
      {
        slug: 'riomadeira',
        name: 'Rio Madeira',
        station: 15400000,
        history: {}
      },
      {
        slug: 'rioamazonas',
        name: 'Rio Amazonas',
        station: 14990000,
        history: {}
      }
    ];
    vm.selectedRiver = {};
    vm.selectRiver = selectRiver;
    vm.isSelectedRiver = isSelectedRiver;

    function init() {
      var river = 'rioacre';
      if ($stateParams.river) {
        river = $stateParams.river;
      }
      selectRiver(river);
    }
    init();

    function selectRiver(riverSlug) {
      for (var i = 0; i < vm.rivers.length; i++) {
        if (vm.rivers[i].slug === riverSlug) {
          vm.selectedRiver = vm.rivers[i];
          vm.loading = true;
          History.get({'id': vm.selectedRiver.station}, function(response) {
            vm.selectedRiver.history = response;
            vm.loading = false;
          });
          break;
        }
      }
    }

    function isSelectedRiver(riverSlug) {
      return (vm.selectedRiver.slug === riverSlug);
    }

    var windowEl = angular.element($window);
    var handler = function() {
      $scope.scroll = windowEl.scrollTop();
    }
    windowEl.on('scroll', $scope.$apply.bind($scope, handler));
    handler();
  }
})();
