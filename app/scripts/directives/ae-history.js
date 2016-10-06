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
                tooltipPadding = 45,
                minMaxLineHeight = 25,
                minMaxLinePadding = 0;

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
            var dots = focus.append("g")
                .attr("class", "dots")
                .attr("opacity", 0);
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

            var minMaxOfExtent = {
              data: null,
              min: null,
              max: null
            };

            var maxValueSvg = svg.append("text")
              .attr("class", "legend")
              .attr("x", margin.left)
              .attr("y", 50)
              .text("");

            var minValueSvg = svg.append("text")
              .attr("class", "legend")
              .attr("x", margin.left)
              .attr("y", 70)
              .text("");

            d3noConflict.csv("population.csv", type, function (error, data) {

              data.sort(function(a, b) {
                return a.date - b.date;
              });

              var max = d3noConflict.max(data.map(function (d) { return d.price; }));
              var extent = d3noConflict.extent(data.map(function (d) { return d.date; }));
              x.domain(extent);
              y.domain([0, max]);
              x2.domain(x.domain());
              y2.domain(y.domain());

              area.attr("d", areavalue(data));
              line.attr("d", linevalue(data));

              dots.append("circle").attr("class", "dots max");
              dots.append("circle").attr("class", "dots min");
              // focus.append("line")
              //     .attr("class", "warning-line")
              //     .attr({"x1": 0, "y1": y(1350), "x2": width, "y2": y(1350)});
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
              context.selectAll(".tick text")
                  .on("click", selectYear);
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
                if (brush.empty()) {
                  x.domain(x2.domain());
                  minMaxOfExtent = {
                    data: null,
                    min: null,
                    max: null
                  };
                  maxValueSvg.text("");
                  minValueSvg.text("");
                  dots.transition(500)
                    .attr("opacity", 0);
                  dots.select(".dots.max")
                    .transition(500)
                    .attr("r", 50);
                  dots.select(".dots.min")
                    .transition(500)
                    .attr("r", 50);
                } else {
                  x.domain(brush.extent());
                  minMaxOfExtent = getMinMaxOfExtent(data, brush.extent());
                  maxValueSvg.text("Maior medição: [" + minMaxOfExtent.max.value + " em "+ formatTimeLiteral(minMaxOfExtent.max.date) +"]");
                  minValueSvg.text("Menor medição: [" + minMaxOfExtent.min.value + " em " + formatTimeLiteral(minMaxOfExtent.min.date)+"]");
                  dots.transition(500)
                    .attr("opacity", 1);
                  dots.select(".dots.max")
                    .transition(500)
                    .attr("r", 10);
                  dots.select(".dots.max")
                    .attr("cx", x(minMaxOfExtent.max.date))
                    .attr("cy", y(minMaxOfExtent.max.value));
                  dots.select(".dots.min")
                    .transition(500)
                    .attr("r", 10);
                  dots.select(".dots.min")
                    .attr("cx", x(minMaxOfExtent.min.date))
                    .attr("cy", y(minMaxOfExtent.min.value));
                }
                focus.select(".area").attr("d", areavalue(data));
                focus.select(".line").attr("d", linevalue(data));
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
                selectedValueLine.attr({"x1": x(d.date), "y1": (y(max)-tooltipPadding), "x2": x(d.date), "y2": y(0)});
                selectedValueText.attr("transform", "translate(" + x(d.date) + "," + (y(max)-(tooltipHeight/2)-tooltipPadding) + ")");
                selectedValueText.text(d.price+" em "+formatTimeLiteral(d.date));
                selectedValueRect.attr({"x": (x(d.date)-(tooltipWidth/2)), "y": (y(max)-tooltipHeight-tooltipPadding)});
              }

              function selectYear() {
                console.log(this.innerHTML);
                brush.extent([new Date(this.innerHTML + '-01-01'), new Date(this.innerHTML + '-12-31')]);
                brush(d3.select(".brush").transition());
                brush.event(d3.select(".brush").transition());
              }
            });

            function type(d) {
              d.date = parseDate(d.date);
              d.price = +d.price;
              return d;
            }

            function getMinMaxOfExtent(data, extent) {
          		var startIndex;
          		var start = _.find(data, function(d, i) {
          			startIndex = i;
          			return extent[0].getFullYear() == d.date.getFullYear() &&
          				extent[0].getMonth() == d.date.getMonth();
          		});

          		var dataFrom = _.rest(data, startIndex);

          		var between = [];

          		var end = _.find(dataFrom, function(d) {
          			between.push(d);
          			return extent[1].getFullYear() == d.date.getFullYear() &&
          				extent[1].getMonth() == d.date.getMonth();
          		});

              var
                maxValue = -9999,
                maxDate,
                minValue = 9999,
                minDate;

          		_.each(between, function(d) {
                if (d.price > maxValue) {
                  maxValue = d.price;
                  maxDate = d.date;
                }
                if (d.price < minValue) {
                  minValue = d.price;
                  minDate = d.date;
                }
          		});

          		return {
          			data: between,
          			min: {
                  value: minValue,
                  date: minDate
                },
          			max: {
                  value: maxValue,
                  date: maxDate
                }
          		};

          	}

        }
      }
    }
})();
