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
          river: '=',
          start: '=',
          end: '='
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

            var bisectDate = d3noConflict.bisector(function(d) { return d.date; }).left;

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

            var customTimeFormat = localized.timeFormat.multi([
            	[".%L", function(d) { return d.getMilliseconds(); }],
            	[":%S", function(d) { return d.getSeconds(); }],
            	["%I:%M", function(d) { return d.getMinutes(); }],
            	["%Hh", function(d) { return d.getHours(); }],
            	["%d %a", function(d) { return d.getDay() && d.getDate() != 1; }],
            	["%d %b", function(d) { return d.getDate() != 1; }],
            	["%B", function(d) { return d.getMonth(); }],
            	["%Y", function() { return true; }]
            ]);

            var formatTimeLiteral = localized.timeFormat("%d de %B  de %Y");

            var x = d3noConflict.time.scale().range([0, width]),
                x2 = d3noConflict.time.scale().range([0, width]),
                y = d3noConflict.scale.linear().range([height, 0]),
                y2 = d3noConflict.scale.linear().range([height2, 0]);

            var xAxis = d3noConflict.svg.axis().scale(x).tickFormat(customTimeFormat),
                xAxis2 = d3noConflict.svg.axis().scale(x2).orient("bottom").ticks(d3noConflict.time.year),
                yAxis = d3noConflict.svg.axis().scale(y)
                  .orient("left");

            var brush = d3noConflict.svg.brush().x(x2);

            var areavalue = d3noConflict.svg.area()
                // .interpolate("monotone")
                .x(function (d) { return x(d.date); })
                .y0(height)
                .y1(function (d) { return y(d.measured); });
            var linevalue = d3noConflict.svg.line()
                // .interpolate("monotone")
                .defined(function(d) { return d.measured; })
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.measured); });

            var area2 = d3noConflict.svg.area()
                .interpolate("monotone")
                .x(function (d) { return x2(d.date); })
                .y0(height2)
                .y1(function (d) { return y2(d.measured); });

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
            var nullArea = focus.append("path")
                .attr("class", "area area-null");
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
              .attr("x", margin.left+4)
              .attr("y", 50)
              .attr("text-anchor", "start")
              .attr("alignment-baseline", "hanging")
              .text("");

            var minValueSvg = svg.append("text")
              .attr("class", "legend")
              .attr("x", margin.left+4)
              .attr("y", 50)
              .attr("text-anchor", "start")
              .attr("alignment-baseline", "hanging")
              .text("");

            function selectRange(start, end) {
              brush.extent([new Date(start), new Date(end)]);
              brush(d3noConflict.select(".brush").transition());
              brush.event(d3noConflict.select(".brush").transition());
            }

            scope.$watch(function(scope) { return scope.river; }, function(newValue) {
              if (typeof newValue !== 'undefined' && newValue.data) {
                draw(newValue);
              }
            });

            scope.$watch(function(scope) { return scope.start; }, function(newValue) {
              if (typeof newValue !== 'undefined') {
                selectRange(scope.start, scope.end);
              }
            });

            function draw(river) {

              var data = [];
              river.data.forEach(function(d) {
                if (d.measured) {
                  data.push({
                    date: new Date(d.timestamp),
                    measured: Math.round((d.measured * 0.01) * 100) / 100
                  });
                }
              });
              var warningThreshold = Math.round((river.info.warningThreshold * 0.01) * 100) / 100;
              var floodThreshold = Math.round((river.info.floodThreshold * 0.01) * 100) / 100;

              data.sort(function(a, b) {
                return a.date - b.date;
              });

              function diff(date1, date2) {
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                return Math.ceil(timeDiff / (1000 * 3600 * 24));
              }

              var nullData = [];
              for (var i = 0; i < data.length-1; i++) {
                nullData.push(data[i]);
                if (diff(data[i+1].date, data[i].date) > 30) {
                  var newData = {
                    date: data[i].date,
                    measured: null
                  }
                  nullData.push(newData);
                  var newData2 = {
                    date: data[i+1].date,
                    measured: null
                  }
                  nullData.push(newData2);
                }
                if (data.length-2 === i) {
                  nullData.push(data[i+1]);
                }
              }

              var max = d3noConflict.max(data.map(function (d) { return d.measured; }));
              var extent = d3noConflict.extent(data.map(function (d) { return d.date; }));

              var brushExtent = extent;
              var endDate = data[data.length-1].date;
              var startDate = new Date(endDate);
              startDate = new Date(startDate.setMonth(startDate.getMonth() - 120));
              brushExtent = [startDate, endDate];

              x.domain(extent);
              y.domain([0, max]);
              x2.domain(x.domain());
              y2.domain(y.domain());

              area.attr("d", areavalue(data));
              nullArea.attr("d", areavalue(nullData));
              line.attr("d", linevalue(data));
              if (warningThreshold > 0) {
                focus.append("line")
                  .attr("class", "warning-line")
                  .attr("x1", 0)
                  .attr("y1", y(warningThreshold))
                  .attr("x2", width)
                  .attr("y2", y(warningThreshold));
                focus.append("text")
                  .attr({
                    "x": margin.right + 10,
                    "y": y(warningThreshold) + 12,
                    "fill": "#ebb03e",
                    "opacity": 1,
                    "font-size": "12",
                    "font-family": "sans"
                  })
                  .text("Nível de alerta");
              }
              if (floodThreshold > 0) {
                focus.append("line")
                  .attr("class", "flood-line")
                  .attr("x1", 0)
                  .attr("y1", y(floodThreshold))
                  .attr("x2", width)
                  .attr("y2", y(floodThreshold));
                focus.append("text")
                  .attr({
                    "x": margin.right + 10,
                    "y": y(floodThreshold) - 4,
                    "fill": "#e74c3c",
                    "opacity": 1,
                    "font-size": "12",
                    "font-family": "sans"
                  })
                  .text("Nível de enchente");
              }

              dots.append("line").attr("class", "dots line-max");
              dots.append("line").attr("class", "dots line-min");
              focus.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                  .call(xAxis);
              focus.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .attr("transform", "rotate(-90)")
                    .text("Volume (m)");

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

              brush.extent(brushExtent);
              brush.on("brush", brushed);
              context.select('.brush').call(brush);
              brushed();
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
                  d3noConflict.select("#desc").style("display", "none");
                } else {
                  x.domain(brush.extent());
                  minMaxOfExtent = getMinMaxOfExtent(data, brush.extent());
                  maxValueSvg.text("Máxima de " + minMaxOfExtent.max.value.toString().replace('.', ',') + "m");// em "+ formatTimeLiteral(minMaxOfExtent.max.date));
                  minValueSvg.text("Mínima de " + minMaxOfExtent.min.value.toString().replace('.', ',') + "m");// em " + formatTimeLiteral(minMaxOfExtent.min.date));
                  maxValueSvg.attr("transform", "translate("+x(minMaxOfExtent.max.date)+","+y(minMaxOfExtent.max.value)+")");
                  minValueSvg.attr("transform", "translate("+x(minMaxOfExtent.min.date)+","+y(minMaxOfExtent.min.value)+")");
                  dots.transition(1000)
                    .attr("opacity", 1);
                  dots.select(".dots.line-max")
                    .attr("x1", x(minMaxOfExtent.max.date))
                    .attr("y1", y(minMaxOfExtent.max.value)-30)
                    .attr("x2", x(minMaxOfExtent.max.date))
                    .attr("y2", y(minMaxOfExtent.max.value));
                  dots.select(".dots.line-min")
                    .attr("x1", x(minMaxOfExtent.min.date))
                    .attr("y1", y(minMaxOfExtent.min.value)-30)
                    .attr("x2", x(minMaxOfExtent.min.date))
                    .attr("y2", y(minMaxOfExtent.min.value));

                  // Set description
                  d3noConflict.select("#desc").style("display", null);
                  d3noConflict.select("#desc-max").text(minMaxOfExtent.max.value + "m");
                  d3noConflict.select("#desc-max-date").text(formatTimeLiteral(minMaxOfExtent.max.date));
                  d3noConflict.select("#desc-min").text(minMaxOfExtent.min.value + "m");
                  d3noConflict.select("#desc-min-date").text(formatTimeLiteral(minMaxOfExtent.min.date));
                }
                focus.select(".area").attr("d", areavalue(data));
                focus.select(".area.area-null").attr("d", areavalue(nullData));
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

                selectedValueCircle.attr("transform", "translate(" + x(d.date) + "," + y(d.measured) + ")");
                selectedValueLine.attr({"x1": x(d.date), "y1": (y(max)-tooltipPadding), "x2": x(d.date), "y2": y(0)});
                selectedValueText.text(d.measured.toString().replace('.', ',')+"m em "+formatTimeLiteral(d.date));

                var xTooltip;
                if (x(d.date) > width - tooltipWidth/2 + 10) {
                  xTooltip = width - tooltipWidth/2 + 10;
                } else if (x(d.date) < tooltipWidth/2) {
                  xTooltip = tooltipWidth/2;
                } else {
                  xTooltip = x(d.date);
                }
                selectedValueText.attr("transform", "translate(" + xTooltip + "," + (y(max)-(tooltipHeight/2)-tooltipPadding) + ")");
                selectedValueRect.attr({"x": (xTooltip-(tooltipWidth/2)), "y": (y(max)-tooltipHeight-tooltipPadding)});
              }

            }

            function getMinMaxOfExtent(data, extent) {
          		var startIndex;

              _.find(data, function(d, i) {
          			startIndex = i;
          			return extent[0].getFullYear() === d.date.getFullYear() &&
          				extent[0].getMonth() === d.date.getMonth();
          		});

          		var dataFrom = _.rest(data, startIndex);

          		var between = [];

          		_.find(dataFrom, function(d) {
          			between.push(d);
          			return extent[1].getFullYear() === d.date.getFullYear() &&
          				extent[1].getMonth() === d.date.getMonth();
          		});

              var
                maxValue = -9999,
                maxDate,
                minValue = 9999,
                minDate;

          		_.each(between, function(d) {
                if (d.measured > maxValue) {
                  maxValue = d.measured;
                  maxDate = d.date;
                }
                if (d.measured < minValue) {
                  minValue = d.measured;
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
      };
    }
})();
