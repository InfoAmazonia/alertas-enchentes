(function() {
  'use strict';

  angular.module('alertasEnchentesApp')
    .directive('aeHistory', aeHistory);

    aeHistory.$inject = [];

    /*jshint latedef: nofunc */
    function aeHistory() {
      return {
        template: '<svg></svg>',
        restrict: 'E',
        scope: {
          history: '='
        },
        link: function postLink(scope, element) {
          var d3noConflict = d3;
          var margin = { top: 80, right: 10, bottom: 100, left: 40 },
                margin2 = { top: 430, right: 10, bottom: 20, left: 40 },
                width = 1960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom,
                height2 = 500 - margin2.top - margin2.bottom,
                tooltipWidth = 300,
                tooltipHeight = 30,
                tooltipPadding = 45;

            var parseDate = d3noConflict.time.format("%d/%m/%Y").parse,
              bisectDate = d3noConflict.bisector(function(d) { return d.date; }).left;

            var localized = d3noConflict.locale({
              "decimal": ",",
              "thousands": ".",
              "grouping": [3],
              "currency": ["R$", ""],
              "dateTime": "%d/%m/%Y %H:%M:%S",
              "date": "%d/%m/%Y",
              "time": "%H:%M:%S",
              "periods": ["AM", "PM"],
              "days": ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
              "shortDays": ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
              "months": ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
              "shortMonths": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
            });

            var formatTimeLiteral = localized.timeFormat("%d de %B  de %Y");

            var x = d3noConflict.time.scale().range([0, width]),
                x2 = d3noConflict.time.scale().range([0, width]),
                y = d3noConflict.scale.linear().range([height, 0]),
                y2 = d3noConflict.scale.linear().range([height2, 0]);

            var xAxis = d3noConflict.svg.axis().scale(x)
                  .orient("bottom")
                  .ticks(d3noConflict.time.year)
                  .innerTickSize(-height)
                  .outerTickSize(0)
                  .tickPadding(10),
                xAxis2 = d3noConflict.svg.axis().scale(x2).orient("bottom").ticks(d3noConflict.time.year),
                yAxis = d3noConflict.svg.axis().scale(y)
                  .orient("left");

            var brush = d3noConflict.svg.brush().x(x2);

            var areavalue = d3noConflict.svg.area()
                .interpolate("monotone")
                .x(function (d) { return x(d.date); })
                .y0(height)
                .y1(function (d) { return y(d.price); });
            var linevalue = d3noConflict.svg.line()
                .interpolate("monotone")
                .defined(function(d) { return d.price; })
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.price); });

            var area2 = d3noConflict.svg.area()
                .interpolate("monotone")
                .x(function (d) { return x2(d.date); })
                .y0(height2)
                .y1(function (d) { return y2(d.price); });

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
                .attr("height", height + margin.top)
                .attr("transform", "translate(0," + -margin.top + ")");

            var focus = svg.append("g")
                .attr("class", "focus")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var area = focus.append("path")
                .attr("class", "area");
            var line = focus.append("path")
                .attr("class", "line");
            focus.append("g")
                .attr("class", "dots");
            var rectMouse = focus.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", "none")
                .style("pointer-events", "all");
            var selectedValue = focus.append("g")
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
                .attr("x", 9)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle");

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            d3noConflict.csv("population.csv", type, function (error, data) {

              data.sort(function(a, b) {
                return a.date - b.date;
              });
              var
                currentYear,
                year,
                years = [],
                maxData = [],
                minData = [];
              data.forEach(function(d) {
                year = d.date.getFullYear();
                if (year !== currentYear) {
                  currentYear = year;
                  years[currentYear] = {
                    min: {
                      date: null,
                      price: null
                    },
                    max: {
                      date: null,
                      price: null
                    },
                    data: []
                  }
                }
                years[currentYear].data.push(d);
              });
              years.forEach(function(year, key) {
                var
                  maxValue = -9999,
                  minValue = 9999,
                  maxDate = null,
                  minDate = null;
                year.data.forEach(function(y) {
                  if (y.price > maxValue) {
                    years[key].max.date = y.date;
                    years[key].max.price = y.price;
                    maxDate = y.date;
                    maxValue = y.price;
                  }
                  if (y.price < minValue) {
                    years[key].min.date = y.date;
                    years[key].min.price = y.price;
                    minValue = y.price;
                    minDate = y.date;
                    minValue = y.price;
                  }
                });
                maxData.push(
                  {
                    date: maxDate,
                    price: maxValue
                  }
                );
                minData.push(
                  {
                    date: minDate,
                    price: minValue
                  }
                );
              });
              var max = d3noConflict.max(data.map(function (d) { return d.price; }));
              var extent = d3noConflict.extent(data.map(function (d) { return d.date; }));
              x.domain(extent);
              y.domain([0, max]);
              x2.domain(x.domain());
              y2.domain(y.domain());

              area.attr("d", areavalue(data));
              line.attr("d", linevalue(data));

              focus.selectAll(".dots.max")
                .data(maxData)
              .enter().append("circle")
                .attr("class", "dots max")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.price); });
              // focus.selectAll(".dots-line.max")
              //   .data(maxData)
              // .enter().append("line")
              //   .attr("class", "dots-line max")
              //   .attr("x1", function(d) { return x(d.date); })
              //   .attr("y1", function(d) { return y(d.price)-minMaxLineHeight; })
              //   .attr("x2", function(d) { return x(d.date); })
              //   .attr("y2", function(d) { return y(d.price); });

              focus.selectAll(".dots.min")
                .data(minData)
              .enter().append("circle")
                .attr("class", "dots min")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.price); });

              // focus.append("line")
              //     .attr("class", "warning-line")
              //     .attr({"x1": 0, "y1": y(1350), "x2": width, "y2": y(1350)});
              // years.forEach(function(year) {
              //   dots.append("circle")
              //     .attr("r", 3.5)
              //     .style("fill", "green")
              //     .attr("cx", function(d) { return x(year.max.date); })
              //     .attr("cy", function(d) { return y(year.max.price); });
              //   dots.append("circle")
              //     .attr("r", 3.5)
              //     .style("fill", "red")
              //     .attr("cx", function(d) { return x(year.min.date); })
              //     .attr("cy", function(d) { return y(year.min.price); });
              // });
              focus.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
              focus.append("g")
                  .attr("class", "y axis")
                  .call(yAxis);

              context.append("path")
                  .datum(data)
                  .attr("class", "area2")
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

              brush.extent(extent);
              brush.on("brush", brushed);
              function brushed() {
                x.domain(brush.empty() ? x2.domain() : brush.extent());
                focus.select(".area").attr("d", areavalue(data));
                focus.select(".line").attr("d", linevalue(data));
                focus.select(".x.axis").call(xAxis);
                focus.selectAll(".dots.max")
                  .attr("cx", linevalue.x())
                  .attr("cy", linevalue.y());
                focus.selectAll(".dots.min")
                  .attr("cx", linevalue.x())
                  .attr("cy", linevalue.y());
                // focus.selectAll(".dots-line.max")
                //   .attr("x1", function(d) { return x(d.date); })
                //   .attr("y1", function(d) { return y(d.price)-minMaxLineHeight; })
                //   .attr("x2", function(d) { return x(d.date); })
                //   .attr("y2", function(d) { return y(d.price); });
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
                selectedValueLine.attr({"x1": x(d.date), "y1": (y(max)-tooltipPadding), "x2": x(d.date), "y2": y(0)});
                selectedValueText.attr("transform", "translate(" + x(d.date) + "," + (y(max)-(tooltipHeight/2)-tooltipPadding) + ")");
                selectedValueText.text(d.price+" em "+formatTimeLiteral(d.date));
                selectedValueRect.attr({"x": (x(d.date)-(tooltipWidth/2)), "y": (y(max)-tooltipHeight-tooltipPadding)});
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
