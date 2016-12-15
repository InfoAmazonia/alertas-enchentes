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
              right: 0,
              bottom: 30,
              left: 0
            },
            width = 600 - margin.left - margin.right,
            height = 160 - margin.top - margin.bottom,
            viewBoxWidth = width + margin.left + margin.right,
            viewBoxHeight = height + margin.top + margin.bottom,
            baseValue = 0,
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

          var svg = d3noConflict.select("svg")
            .attr({
              'class': 'timeline-chart',
              'version': '1.1',
              'viewBox': '0 0 '+viewBoxWidth+' '+viewBoxHeight,
              'width': '100%'})
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Draw lines
          var lines = svg.append("g").attr("class", "lines");

          var alertLine = lines.append("line")
            .attr({
              "x1": margin.right*2,
              "x2": width-margin.left*2,
              "fill": "none",
              "stroke-width": "2px",
              "opacity": 0.5,
              "stroke-dasharray": "10,5",
              "stroke": color("ALERTA")
            });
          var alertText = lines.append("text")
            .attr({
              "x": margin.right*2,
              "fill": color("ALERTA"),
              "opacity": 0.5,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de alerta");
          var floodLine = lines.append("line")
            .attr({
              "fill": "none",
              "x1": margin.right*2,
              "x2": width-margin.left*2,
              "stroke-width": "2px",
              "opacity": 0.5,
              "stroke-dasharray": "10,5",
              "stroke": color("INUNDACAO")
            });
          var floodText = lines.append("text")
            .attr({
              "x": margin.right*2,
              "fill": color("INUNDACAO"),
              "opacity": 0.5,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de enchente");

          var bars = svg.append('g').attr('class', 'bars');
          var times = svg.append('g').attr('class', 'times').attr("transform", "translate(" + margin.left + ", 15)");

          scope.$watch(function(scope) { return scope.river; }, function(newValue) {
            if (typeof newValue !== 'undefined' && newValue.data) {
              draw(newValue);
            }
          });

          function draw(river) {
            if (river.data.length < 1)  return;

            var data = river.data;
            var hasPrediction = 0;
            data.forEach(function(d) {
              d.predicted = +d.predicted;
              if (d.predicted) {
                hasPrediction++;
              }
            });

            if (!hasPrediction) {
              svg.select('.bars').selectAll('*').remove();
              svg.select('.times').selectAll('*').remove();
              lines.attr('display', 'none');
              return;
            } else {
              lines.attr('display', 'block');
            }

            var domainMin = d3noConflict.min(data, function(d) { return d.predicted; });
            var domainMax = d3noConflict.max(data, function(d) { return d.predicted; });
            if (domainMax < river.info.floodThreshold) {
                var domainMax = river.info.floodThreshold;
            }
            x.domain(data.map(function(d) { return d.timestamp; }));
            y.domain([domainMin, domainMax]);

            alertLine.attr({
              "y1": y(river.info.warningThreshold),
              "y2": y(river.info.warningThreshold),
            });
            alertText.attr({
              "y": y(river.info.warningThreshold) + 12,
            });
            floodLine.attr({
              "y1": y(river.info.floodThreshold),
              "y2": y(river.info.floodThreshold),
            });
            floodText.attr({
              "y": y(river.info.floodThreshold) - 4,
            });

            svg.select('.bars').selectAll('*').remove();
            svg.select('.times').selectAll('*').remove();

            bars.selectAll(".bar").data(data).enter()
              .append("rect")
                .attr("x", function(d) { return x(d.timestamp); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.predicted); })
                .attr("height", function(d) { return height - y(d.predicted) + baseValue; })
                .attr("fill", function(d) { return color(d.predictedStatus); })
                .style("opacity", 0.4)
                .on("mouseover", function(d) {
                  d3noConflict.select(this).transition().duration(200).style("opacity", 1);
                  var m = Math.round((d.predicted * 0.001) * 100) / 100;
                  d3noConflict.select('.alert-measure').text(m+"m");
                  d3noConflict.select('.alert-time').text(moment(d.timestamp*1000).format("H:mm"));
                })
                .on("mouseout", function(d) {
                  d3noConflict.select(this).transition().duration(200).style("opacity", 0.4);
                });
            bars.selectAll(".bar").data(data).enter()
              .append("rect")
                .attr("width", x.rangeBand())
                .attr("x", function(d) { return x(d.timestamp); })
                .attr("y", function(d) { return y(d.predicted); })
                .attr("fill", function(d) { return color(d.predictedStatus); })
                .attr("height", function(d) { return (d.predicted) ? 2 : 0 });
            times.selectAll(".time").data(data).enter()
              .append("text")
                .attr("fill", "#fff")
                .attr("font-size", "12px")
                .attr("text-anchor", "start")
                .attr("x", function(d) { return x(d.timestamp)+x.rangeBand()+4; })
                .attr("y", height + baseValue)
                .text(function(d, i) {
                    var minutes = moment(d.timestamp*1000).format("mm");
                    if (minutes === "00" && i !== data.length-1) {
                      return moment(d.timestamp*1000).format("H:mm");
                    }
                });
          }

          function color(predictedStatus) {
            switch (predictedStatus) {
              case "NORMAL":
                return "#1878f0";
                break;
              case "ALERTA":
                return "#faea59";
                break;
              case "INUNDACAO":
                return "#eb533e";
                break;
              default:
                return "#1878f0";
            }
          }


        }
      };
    }
})();
