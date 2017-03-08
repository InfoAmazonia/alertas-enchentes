(function() {
'use strict';

  angular.module('alertasEnchentesApp')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$window', 'olData', 'Prediction', 'Now'];

  function MainCtrl($scope, $window, olData, Prediction, Now) {
    var vm = this;
    vm.loading = false;
    vm.select = false;
    vm.rivers = [
      {
        slug: 'rioacre',
        name: 'Rio Acre',
        city: 'Rio Branco',
        station: 13600010,
        history: {},
        data: {},
        alert: {}
      },
      {
        slug: 'riomadeira',
        name: 'Rio Madeira',
        city: 'Porto Velho',
        station: 15400000,
        history: {},
        data: {},
        alert: {}
      },
      {
        slug: 'rionegro',
        name: 'Rio Negro',
        city: 'Manaus',
        station: 14990000,
        history: {},
        data: {},
        alert: {}
      }
    ];
    vm.timestamp = moment().format('H:mm');
    vm.selectedRiver = {};
    vm.selectRiver = selectRiver;
    vm.hideCard = hideCard;
    vm.isSelectedRiver = isSelectedRiver;
    var smallDevice = ($(window).width() <= 998);
    vm.map = {
      center: {
        lat: (smallDevice) ? -2 : -6,
        lon: (smallDevice) ? -65 : -70,
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
              message: 'Rio Branco',
              show: true,
              showOnMouseOver: true
          }
        },
        {
          lat: -8.748149,
          lon: -63.917471,
          label: {
              message: 'Porto Velho',
              show: true,
              showOnMouseOver: true
          }
        },
        {
          lat: -3.1383,
          lon: -60.0272,
          label: {
              message: 'Manaus',
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
      // selectRiver('rioacre');
    }
    init();

    function selectRiver(riverSlug) {
      for (var i = 0; i < vm.rivers.length; i++) {
        if (vm.rivers[i].slug === riverSlug) {
          vm.select = true;
          vm.loading = true;
          vm.selectedRiver = vm.rivers[i];
          Prediction.get({'id': vm.rivers[i].station}, function(response) {
            Now.get({'id': vm.rivers[i].station}, function(now) {
              vm.timestamp = moment().format('H:mm');
              vm.selectedRiver.data = response;
              vm.selectedRiver.alert = now;
              vm.selectedRiver.past = getAlertPast(response);
              vm.loading = false;
            });
          }, function(error) {
            vm.timestamp = moment().format('H:mm');
            vm.selectedRiver.data = {};
            vm.selectedRiver.alert = {
              title: "--",
              description: "Não foi possível obter dados de previsão",
              timestamp: null
            }
            vm.loading = false;
          });
          break;
        }
      }
    }

    function isSelectedRiver(riverSlug) {
      return (vm.selectedRiver.slug === riverSlug);
    }

    function getAlertPast(river) {
      if (river.past) {
        var d = new Date(river.past.timestamp*1000);
        return "A última vez que este rio atingiu este nível foi em "+moment(d).format('D[/]M[/]Y [às] H[h]mm');
      }
      return "";
    }

    function getAlertTimestamp(river) {
      if (!river.data.length) {
        return {
          title: "--",
          description: "Não foi possível obter dados",
          timestamp: null
        };
      }
      // Checks prediction
      var hasPrediction = 0;
      for (var i = 0; i < river.data.length; i++) {
        if (river.data[i].predicted) {
          hasPrediction++;
        };
      }
      if (!hasPrediction) {
        return {
          title: "--",
          description: "Não foi possível obter dados de previsão",
          timestamp: null
        };
      }
      // Checks flood threshold
      for (var i = 0; i < river.data.length; i++) {
        if (river.data[i].predicted >= river.info.floodThreshold) {
          return {
            title: "Alerta de enchente",
            description: "Ação evasiva é recomendada",
            timestamp: data[i].id.timestamp
          };
        };
      }
      // Checks warning threshold
      for (var i = 0; i < river.data.length; i++) {
        if (river.data[i].predicted >= river.info.warningThreshold) {
          return {
            title: "Alerta de cheia",
            description: "Esteja preparado",
            timestamp: data[i].id.timestamp
          };
        };
      }
      return {
        title: "Dia normal",
        description: "Nenhuma alta prevista para as próximas horas",
        timestamp: null
      };
    }

    function hideCard() {
      vm.select = false;
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
