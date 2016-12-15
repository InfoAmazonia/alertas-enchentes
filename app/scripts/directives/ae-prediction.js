(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .directive('aePrediction', aePrediction);

    aePrediction.$inject = [];

    /*jshint latedef: nofunc */
    function aePrediction() {
      return {
        template: '<svg></svg>',
        restrict: 'E',
        scope: {
          river: '='
        },
        link: function postLink(scope, element) {
          var d3noConflict = d3;

          var
            margin = {
              top: 50,
              right: 10,
              bottom: 30,
              left: 10
            },
            width = 600 - margin.left - margin.right,
            height = 160 - margin.top - margin.bottom,
            viewBoxWidth = width + margin.left + margin.right,
            viewBoxHeight = height + margin.top + margin.bottom,
            baseValue = margin.bottom,
            tooltipWidth = 50,
            tooltipHeight = 30;

            var x = d3noConflict.scale.ordinal()
                .rangeRoundBands([0, width], 0);
            var y = d3noConflict.scale.linear()
                .range([height, 0]);
            var xAxis = d3noConflict.svg.axis()
                .scale(x)
                .orient("bottom");
            var yAxis = d3noConflict.svg.axis()
                .scale(y)
                .orient("left");
            // x.domain(data.map(function(d) { return d.timestamp; }));
            // y.domain([d3noConflict.min(data, function(d) { return d.predicted; }), d3noConflict.max(data, function(d) { return d.predicted; })]);

          var svg = d3noConflict.select("svg")
            .attr({
              'class': 'timeline-chart',
              'version': '1.1',
              'viewBox': '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom),
              'width': '100%'})
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          scope.$watch(function(scope) { return scope.river; }, function(newValue) {
            if (typeof newValue !== 'undefined' && newValue.data) {
              draw(newValue);
            }
          });

          function draw(river) {
            console.log(river);
            // var data = [];
            // river.data.forEach(function(d) {
            //   if (d.measured) {
            //     data.push({
            //       date: new Date(d.timestamp),
            //       measured: Math.round((d.measured * 0.001) * 100) / 100
            //     });
            //   }
            // });
            // var warningThreshold = Math.round((river.info.warningThreshold * 0.001) * 100) / 100;
            // var floodThreshold = Math.round((river.info.floodThreshold * 0.001) * 100) / 100;
            //
            // data.sort(function(a, b) {
            //   return a.date - b.date;
            // });

          }


        }
      };
    }
})();
