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
              top: 35,
              right: 10,
              bottom: 30,
              left: 30
            },
            width = 600 - margin.left - margin.right,
            height = 220 - margin.top - margin.bottom,
            viewBoxWidth = width + margin.left + margin.right,
            viewBoxHeight = height + margin.top + margin.bottom,
            baseValue = 0,
            tooltipWidth = 170,
            tooltipHeight = 30,
            tooltipPadding = -20;

            var bisectDate = d3noConflict.bisector(function(d) { return d.timestamp; }).left;
            var formatTimeLiteral = d3noConflict.time.format("%Hh%M");
            var formatDateTimeLiteral = d3noConflict.time.format("%d/%m/%Y às %Hh%M");

            var x = d3noConflict.time.scale()
                .range([0, width]);
            var y = d3noConflict.scale.linear()
                .range([height, 0]);
            var valuearea = d3noConflict.svg.area()
                .x(function(d) { return x(d.timestamp); })
                .y1(function(d) { return y(d.measured); });
            var valueline = d3noConflict.svg.line()
              .x(function(d) { return x(d.timestamp); })
              .y(function(d) { return y(d.measured); });
            var valueline2 = d3noConflict.svg.line()
              .x(function(d) { return x(d.timestamp); })
              .y(function(d) { return y(d.predicted); });
            var xAxis = d3noConflict.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(12)
                .tickFormat(d3.time.format("%Hh"));
            var yAxis = d3noConflict.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(6)
                .tickFormat(function(d) {
                  return Math.round((d * 0.01) * 100) / 100
                });

          var svg = d3noConflict.select("svg")
            .attr({
              'class': 'timeline-chart',
              'version': '1.1',
              'viewBox': '0 0 '+viewBoxWidth+' '+viewBoxHeight,
              'width': '100%'})
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // Draw lines
          var areaG = svg.append("g").attr("class", "areaG");
          var linesG = svg.append("g").attr("class", "lines");

          var areaSVG = areaG.append("path")
            .attr("class", "area");
          var line2SVG = areaG.append("path")
            .attr("class", "line2");

          var axisSVG = areaG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x axis");

          var axisYSVG = areaG.append("g")
            .attr("class", "y axis");

          var attentionLine = linesG.append("line")
          .attr({
            "x1": 0,
            "x2": width,
            "fill": "none",
            "stroke-width": "2px",
            "opacity": 1,
            "stroke-dasharray": "10,5",
            "stroke": color("ATENCAO")
          });
          var attentionText = linesG.append("text")
          .attr({
            "x": margin.right,
            "fill": color("ATENCAO"),
            "opacity": 1,
            "font-size": "10",
            "font-family": "sans"
          })
          .text("Nível de atenção");
          var alertLine = linesG.append("line")
            .attr({
              "x1": 0,
              "x2": width,
              "fill": "none",
              "stroke-width": "2px",
              "opacity": 1,
              "stroke-dasharray": "10,5",
              "stroke": color("ALERTA")
            });
          var alertText = linesG.append("text")
            .attr({
              "x": margin.right,
              "fill": color("ALERTA"),
              "opacity": 1,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de alerta");
          var floodLine = linesG.append("line")
            .attr({
              "fill": "none",
              "x1": 0,
              "x2": width,
              "stroke-width": "2px",
              "opacity": 1,
              "stroke-dasharray": "10,5",
              "stroke": color("INUNDACAO")
            });
          var floodText = linesG.append("text")
            .attr({
              "x": margin.right,
              "fill": color("INUNDACAO"),
              "opacity": 1,
              "font-size": "10",
              "font-family": "sans"
            })
            .text("Nível de enchente");
          var predictionText = linesG.append("text")
            .attr({
              "fill": color("NORMAL"),
              "opacity": 1,
              "font-size": "10",
              "font-family": "sans",
              "text-anchor": "end"
            })
            .text("Previsão");

          var dots = svg.append("g")
              .attr("class", "dots")
              .attr("opacity", 0);
          var rectMouse = svg.append("rect")
              .attr("width", width)
              .attr("height", height)
              .style("fill", "none")
              .style("pointer-events", "all");
          var selectedValue = svg.append("g")
              .attr("class", "selected-value")
              .style("display", "none");
          var selectedValueLine = selectedValue.append("line");
          var selectedValueCircle = selectedValue.append("g");
              selectedValueCircle.append("circle").attr("r", 8);
              selectedValueCircle.append("circle").attr("r", 5);
          var selectedValueRect = selectedValue.append("rect")
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("width", tooltipWidth)
              .attr("height", tooltipHeight);
          var selectedValueText = selectedValue.append("text")
              .attr("x", 5)
              .attr("dy", ".35em")
              .attr("text-anchor", "middle");

          scope.$watch(function(scope) { return scope.river; }, function(newValue) {
            if (typeof newValue !== 'undefined' && newValue.data) {
              draw(newValue);
            }
          });

          function draw(river) {
            d3noConflict.select('#alert-timestamp').text(formatDateTimeLiteral(new Date(river.params.timestamp*1000)));
            if (river.data.length < 1)  return;

            var data = [];
            var data2 = [];
            river.data.forEach(function(d) {
              d.timestamp = new Date(d.timestamp*1000);
              if (d.measured !== null) {
                data.push(d);
              }
              if (d.predicted !== null) {
                data2.push(d);
              }
            });

            var domainMax = d3noConflict.max(data, function(d) { return d.measured; });
            var domainMin = d3noConflict.min(data, function(d) { return d.measured; });
            if (!river.info.floodThreshold) {
              var max = river.info.warningThreshold;
            } else {
              var max = river.info.floodThreshold;
            }
            if (domainMax < max) {
              domainMax = max;
            }
            if (domainMin > max - 1000) {
              domainMin = max - 1000;
            }
            x.domain(d3.extent(river.data, function(d) { return d.timestamp; }));
            y.domain([domainMin - 10, domainMax + 10]);
            valuearea.y0(y(domainMin));

            if (river.info.attentionThreshold) {
              attentionLine.attr({
                "y1": y(river.info.attentionThreshold),
                "y2": y(river.info.attentionThreshold)
              }).style("visibility", "visible");
              attentionText.attr({
                "y": y(river.info.attentionThreshold) - 4,
              }).style("visibility", "visible");
            } else {
              attentionLine.style("visibility", "hidden");
              attentionText.style("visibility", "hidden");
            }
            if (river.info.warningThreshold) {
              alertLine.attr({
                "y1": y(river.info.warningThreshold),
                "y2": y(river.info.warningThreshold)
              }).style("visibility", "visible");
              alertText.attr({
                "y": y(river.info.warningThreshold) - 4,
              }).style("visibility", "visible");
            } else {
              alertLine.style("visibility", "hidden");
              alertText.style("visibility", "hidden");
            }
            if (river.info.floodThreshold) {
              floodLine.attr({
                "y1": y(river.info.floodThreshold),
                "y2": y(river.info.floodThreshold),
              }).style("visibility", "visible");
              floodText.attr({
                "y": y(river.info.floodThreshold) - 4,
              }).style("visibility", "visible");
            } else {
              floodLine.style("visibility", "hidden");
              floodText.style("visibility", "hidden");
            }
            if (data2.length) {
              predictionText.attr({
                "x": x(data2[data2.length-1].timestamp),
                "y": y(data2[data2.length-1].predicted) - 4,
              }).style("visibility", "visible");
            } else {
              predictionText.style("visibility", "hidden");
            }

            areaSVG.datum(data)
              .attr("d", valuearea);
            line2SVG.datum(data2)
              .attr("d", valueline2);

            axisSVG.call(xAxis);
            axisYSVG.call(yAxis);

            rectMouse
              .on("mouseover", mouseover)
              .on("mouseout", mouseout)
              .on("mousemove", mousemove);

            function mouseover() {
              if (!data2.length) return;
              selectedValue.style("display", null);
            }

            function mouseout() {
              if (!data2.length) return;
              selectedValue.style("display", "none");
            }

            function mousemove() {
              if (!data2.length) return;
              var
                x0 = x.invert(d3noConflict.mouse(this)[0]),
                i = bisectDate(data2, x0, 1),
                d0 = data2[i - 1],
                d1 = data2[i],
                d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0,
                measured = Math.round((d.predicted * 0.01) * 100) / 100;
              selectedValueCircle.attr("transform", "translate(" + x(d.timestamp) + "," + y(d.predicted) + ")");
              selectedValueLine.attr({"x1": x(d.timestamp), "y1": (y(d.predicted)+tooltipPadding), "x2": x(d.timestamp), "y2": y(domainMin)});
              selectedValueText.text(measured.toString().replace('.', ',')+"m em "+formatTimeLiteral(d.timestamp));

              var xTooltip;
              if (x(d.timestamp) > width - tooltipWidth/2 + 10) {
                xTooltip = width - tooltipWidth/2 + 10;
              } else if (x(d.timestamp) < tooltipWidth/2) {
                xTooltip = tooltipWidth/2;
              } else {
                xTooltip = x(d.timestamp);
              }

              selectedValueText.attr("transform", "translate(" + xTooltip + "," + (y(d.predicted)-(tooltipHeight/2)+tooltipPadding) + ")");
              selectedValueRect.attr({"x": (xTooltip-(tooltipWidth/2)), "y": (y(d.predicted)-tooltipHeight+tooltipPadding)});
              d3noConflict.select('.alert-tip').style("visible", "visible");
              d3noConflict.select('.alert-measure').text(measured.toString()+"m".replace('.', ','));
              d3noConflict.select('.alert-time').text(formatTimeLiteral(d.timestamp));
            }
          }


          function color(measuredStatus) {
            switch (measuredStatus) {
              case "NORMAL":
                return "#1878F0";
                break;
              case "ATENCAO":
                return "#FFE168";
                break;
              case "ALERTA":
                return "#ebb03e";
                break;
              case "INUNDACAO":
                return "#eb533e";
                break;
              default:
                return "#1878F0";
            }
          }


        }
      };
    }
})();
