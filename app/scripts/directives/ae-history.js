(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .directive('aeHistory', aeHistory);

    aeHistory.$inject = ['$window'];

    /*jshint latedef: nofunc */
    function aeHistory($window) {
      return {
        template: '<svg></svg>',
        restrict: 'E',
        scope: {
          history: '='
        },
        link: function postLink(scope, element) {
          var d3noConflict = d3;
          var margin = { top: 10, right: 10, bottom: 100, left: 40 },
                margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
                width = 1960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                height2 = 500 - margin2.top - margin2.bottom;

            var parseDate = d3noConflict.time.format("%b %Y").parse,
              bisectDate = d3.bisector(function(d) { return d.date; }).left;

            var x = d3noConflict.time.scale().range([0, width]),
                x2 = d3noConflict.time.scale().range([0, width]),
                y = d3noConflict.scale.linear().range([height, 0]),
                y2 = d3noConflict.scale.linear().range([height2, 0]);

            var xAxis = d3noConflict.svg.axis().scale(x).orient("bottom"),
                xAxis2 = d3noConflict.svg.axis().scale(x2).orient("bottom"),
                yAxis = d3noConflict.svg.axis().scale(y)
                  .orient("left")
                  .innerTickSize(-width)
                  .outerTickSize(0)
                  .tickPadding(10);

            var brush = d3noConflict.svg.brush()
                .x(x2);

            var areavalue = d3noConflict.svg.area()
                .interpolate("monotone")
                .x(function (d) { return x(d.date); })
                .y0(height)
                .y1(function (d) { return y(d.price); });

            var area2 = d3noConflict.svg.area()
                .interpolate("monotone")
                .x(function (d) { return x2(d.date); })
                .y0(height2)
                .y1(function (d) { return y2(d.price); });

            function drawBrush() {
              brush.extent([new Date(this.innerText + '-01-01'), new Date(this.innerText + '-12-31')])
              brush(d3noConflict.select(".brush").transition());
              brush.event(d3noConflict.select(".brush").transition().delay(1000))
            }

            var svg = d3noConflict.select("svg")
              .attr({
                'class': 'timeline-chart',
                'version': '1.1',
                'viewBox': '0 0 '+(width + margin.left + margin.right)+' '+(height + margin.top + margin.bottom),
                'width': '100%'});

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
              .append("rect")
                .attr("width", width)
                .attr("height", height);

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var area = focus.append("path")
                .attr("class", "area");

            var rectMouse = focus.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all");
            var selectedValue = focus.append("g")
                .attr("class", "selected-value")
                .style("display", "none");
            var selectedValueLine = selectedValue.append("line");
            var selectedValueCircle = selectedValue.append("circle").attr("r", 6);
            var selectedValueText = selectedValue.append("text").attr("x", 9).attr("dy", ".35em");

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            d3noConflict.csv("population.csv", type, function (error, data) {
              var max = d3noConflict.max(data.map(function (d) { return d.price; }));
              x.domain(d3noConflict.extent(data.map(function (d) { return d.date; })));
              y.domain([0, max]);
              x2.domain(x.domain());
              y2.domain(y.domain());

              area.attr("d", areavalue(data));

              focus.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);

              focus.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);

              context.append("path")
                  .datum(data)
                  .attr("class", "area")
                  .attr("d", area2);

              context.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height2 + ")")
                  .call(xAxis2);

              context.append("g")
                  .attr("class", "x brush")
                  .call(brush)
                .selectAll("rect")
                  .attr("y", -6)
                  .attr("height", height2 + 7);
              rectMouse
                .on("mouseover", mouseover)
                .on("mouseout", mouseout)
                .on("mousemove", mousemove);

              brush.on("brush", brushed);

                function brushed() {
                  x.domain(brush.empty() ? x2.domain() : brush.extent());
                  focus.select(".area").attr("d", areavalue(data));
                  focus.select(".x.axis").call(xAxis);
                }

                function mouseover() {
                  selectedValue.style("display", null);
                }

                function mouseout() {
                  selectedValue.style("display", "none");
                }

                function mousemove() {
                  var x0 = x.invert(d3noConflict.mouse(this)[0]),
                      i = bisectDate(data, x0, 1),
                      d0 = data[i - 1],
                      d1 = data[i],
                      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                  selectedValueCircle.attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
                  selectedValueLine.attr({"x1": x(d.date), "y1": y(max), "x2": x(d.date), "y2": y(0)});
                  selectedValueText.attr("transform", "translate(" + x(d.date) + "," + y(d.price) + ")");
                  selectedValueText.text(d.price);
                }
            });

            function type(d) {
              d.date = parseDate(d.date);
              d.price = +d.price;
              return d;
            }

        }
      }
    }
})();
