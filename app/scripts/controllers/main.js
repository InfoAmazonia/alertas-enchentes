'use strict';

/**
 * @ngdoc function
 * @name alertasEnchentesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the alertasEnchentesApp
 */
angular.module('alertasEnchentesApp')
  .controller('MainCtrl', function () {
    var vm = this;
    var smallDevide = ($(window).width() <= 998);
    vm.map = {
      center: {
        lat: -9.436510,
        lon: -65.616777,
        zoom: (smallDevide) ? 4 : 6
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
              mouseWheelZoom: true
          },
          view: {
              maxZoom: 16,
              minZoom: 4
          }
      }
    }
  });
