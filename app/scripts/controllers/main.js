(function() {
'use strict';

  angular.module('alertasEnchentesApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$window', 'olData'];

  function MainCtrl($scope, $window, olData) {
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
        lat: -6,
        lon: -70,
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
        },
        {
          name: 'Stations',
          active: true,
          source: {
            type: 'GeoJSON',
            url: '/stations.js'
          },
          style: {
            fill: {
                color: 'rgba(0, 0, 0, 0)'
            }
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
        },
        {
          lat: -3.1383,
          lon: -60.0272,
          label: {
              message: 'Rio Amazonas',
              show: true,
              showOnMouseOver: true
          }
        }
      ],
      defaults: {
          events: {
              layers: ['click'],
              map: ['pointermove']
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

    $scope.$on('openlayers.layers.Stations.click', function(event, feature) {
      $scope.$apply(function(scope) {
          if (feature) {
            selectRiver(feature.get('river'));
          }
      });
    });

    $scope.$on('openlayers.map.pointermove', function (e, data) {
        $scope.$apply(function () {
            olData.getMap().then(function (map) {
                var pixel = map.getEventPixel(data.event.originalEvent);
                var hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
                  if (layer.get('name') === 'Stations') {
                    map.getTarget().style.cursor = 'pointer';
                    return true;
                  }
                  return false;
                });

                if (typeof hit === 'undefined') {
                    map.getTarget().style.cursor = '';
                    return;
                }
            });
        });
    });

  }
})();
