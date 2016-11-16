(function() {
'use strict';

  angular.module('alertasEnchentesApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$window'];

  function MainCtrl($scope, $window) {
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
        slug: 'manaus',
        name: 'Rio Amazonas',
        station: 14990000,
        history: {}
      }
    ];
    vm.selectedRiver = {};
    vm.selectRiver = selectRiver;
    vm.isSelectedRiver = isSelectedRiver;
    var smallDevice = ($(window).width() <= 998);
    vm.map = {
      center: {
        lat: -9.436510,
        lon: -65.616777,
        zoom: (smallDevice) ? 4 : 6
      },
      layers: [
        {
          name: 'Satellite',
          active: true,
          source: {
            type: 'MapBox',
            mapId: 'mapbox.satellite',
            accessToken: 'pk.eyJ1IjoiamVmZmVyc29ucnBuIiwiYSI6ImNpcnZhc2FoMTBpZGtmYW04M3IyZTZ6NWoifQ.xTtlY-a--vOAS25Op_7uIA'
          }
        }
      ],
      markers: [
        {
          lat: -9.972892,
          lon: -67.791799,
          label: {
              message: 'Rio Acre',
              show: true,
              showOnMouseOver: true
          }
        },
        {
          lat: -8.748149,
          lon: -63.917471,
          label: {
              message: 'Rio Madeira',
              show: true,
              showOnMouseOver: true
          }
        }
      ],
      defaults: {
          events: {
              layers: [ 'mousemove', 'click' ]
          },
          controls: {
              zoom: false,
              rotate: false,
              attribution: false
          },
          interactions: {
              mouseWheelZoom: false
          },
          view: {
              maxZoom: 16,
              minZoom: 4
          }
      }
    }

    function init() {
      selectRiver('riomadeira');
    }
    init();

    function selectRiver(riverSlug) {
      for (var i = 0; i < vm.rivers.length; i++) {
        if (vm.rivers[i].slug === riverSlug) {
          vm.selectedRiver = vm.rivers[i];
          vm.loading = true;
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
