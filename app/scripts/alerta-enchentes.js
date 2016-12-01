var Alert = (function(window, undefined) {
  var Alert = {};
  Alert.$ = Alert.jQuery = jQuery.noConflict(true);

  function loadScript(url, callback) {
    var script = document.createElement('script');
    script.async = true;
    script.src = url;

    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);

    script.onload = script.onreadystatechange = function() {
      var rdyState = script.readyState;
      if (!rdyState || /complete|loaded/.test(script.readyState)) {
        callback();
        script.onload = null;
        script.onreadystatechange = null;
      }
    }
  }

  function getScriptUrl() {
    var
      scripts = document.getElementsByTagName('script'),
      element,
      src;
    for (var i = 0; i < scripts.length; i++) {
      element = scripts[i];
      src = element.src;

      if (src && /alerta-enchentes\.js/.test(src)) {
        return src
      }
    }
    return null;
  }

  function getUrlParameters(url) {
    var
      query = url.replace(/^.*\?/, ''),
      args = query.split('&'),
      params = {},
      pair,
      key,
      value;

    function decode(string) {
      return decodeURIComponent(string || "").replace('+', ' ');
    }

    for (var i = 0; i < args.length; i++) {
      pair = args[i].split('=');
      key = decode(pair[0]);
      value = decode(pair[1]);
      params[key] = value;
    }
    return params;
  }

  function getWidgetLocation(callback) {
    Alert.$('[data-alerta-enchentes-station]').each(function() {
      var
        location = Alert.$(this),
        station = location.attr('data-alerta-enchentes-station'),
        timestamp = location.attr('data-alerta-enchentes-timestamp'),
        htmlWrapper = 'alerta-enchentes-'+station;
      location.attr('id', htmlWrapper);
      if (!timestamp) {
        timestamp = new Date().getTime();
      }
      var params = {
        htmlWrapper: htmlWrapper,
        station: station,
        timestamp: timestamp
      }
      getData(params, callback)
    });
  }

  function getData(params, callback) {
    Alert.$.ajax({
      method: 'GET',
      url: 'http://enchentes.infoamazonia.org:8080/station/'+params.station+'/prediction',
      data: {},
      success: function(river) {
        callback(river, params.timestamp, params.htmlWrapper);
      },
      error: function(error) {
        console.log("Error");
      }
    });
  }

  function getAlertTimestamp(river) {
    if (!river) return;

    if (!river.data.length) {
      return {
        title: "--",
        description: "Não foi possível obter dados",
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

  function drawWidget(river, timestamp, htmlWrapper) {
    if (!river) return;

    var d3Widget = d3;

    var data = river.data;

    var margin = {
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

    var x = d3Widget.scale.ordinal()
        .rangeRoundBands([0, width], 0);
    var y = d3Widget.scale.linear()
        .range([height, 0]);
    var xAxis = d3Widget.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3Widget.svg.axis()
        .scale(y)
        .orient("left");
    x.domain(data.map(function(d) { return d.timestamp; }));
    y.domain([d3Widget.min(data, function(d) { return d.predicted; }), d3Widget.max(data, function(d) { return d.predicted; })]);

    //Get alert info
    var alertTimestamp = getAlertTimestamp(river);
    var alertHour = null
    if (alertTimestamp.timestamp !== null) {
      var date = new Date(alertTimestamp.timestamp*1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      alertHour = hours + ':' + minutes.substr(-2);
    }

    var mapInfo = d3Widget.select("#"+htmlWrapper)
      .append("div")
        .attr("class", "alerta-enchentes-map-info")
        .style({
          "width": "100%",
          "padding": "20px",
          "background-color": "rgba(11, 51, 65, 0.8)",
          "font": "16px arial,sans-serif-light,sans-serif",
          "color": "#fff"
        });
      mapInfo.append("div")
        .attr("class", "alerta-enchentes-map-time-info")
        .style({
          "font-size": "25px"
        })
        .html(river.info.name);
      mapInfo.append("div")
      .html(moment(timestamp).format('H:mm'));

      // Alert info
      var alertInfo = mapInfo.append("div")
        .attr("class", "alerta-enchentes-alert-info")
        .append("div");
      if (alertHour !== null) {
        alertInfo.append("div")
        .style({
          "margin-top": "10px",
          "margin-right": "12px",
          "font-size": "60px"
        })
        .append("span")
        .html(alertHour);
      }
      var alertInfoText = alertInfo.append("div")
        .style({
          "margin-top": "25px",
          "font-size": "16px"
        });
      alertInfoText.append("div")
        .style({
          "font-size": "22px"
        })
        .html(alertTimestamp.title);
      alertInfoText.append("div")
        .html(alertTimestamp.description);

    // Graph
    if (river.data.length < 1) return;

    var graph = mapInfo.append("div")
    .attr("class", "alerta-enchentes-graph");
    var svg = graph.append("svg")
        .attr("width", "100%")
        .attr("viewBox", "0 0 "+viewBoxWidth+" "+viewBoxHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var domainMin = d3Widget.min(data, function(d) { return d.predicted; });
    var domainMax = d3Widget.max(data, function(d) { return d.predicted; });
    if (domainMax < river.info.floodThreshold) {
        var domainMax = river.info.floodThreshold;
    }
    x.domain(data.map(function(d) { return d.timestamp; }));
    y.domain([domainMin, domainMax]);

    // Draw lines
    svg.append("line")
      .attr({
        "x1": margin.right*2,
        "y1": y(river.info.warningThreshold),
        "x2": width-margin.left*2,
        "y2": y(river.info.warningThreshold),
        "fill": "none",
        "stroke-width": "2px",
        "opacity": 0.5,
        "stroke-dasharray": "10,5",
        "stroke": color("ALERTA")
      });
    svg.append("text")
      .attr({
        "x": margin.right*2,
        "y": y(river.info.warningThreshold) + 12,
        "fill": color("ALERTA"),
        "opacity": 0.5,
        "font-size": "10",
        "font-family": "sans"
      })
      .text("Nível de alerta");
    svg.append("line")
      .attr({
        "fill": "none",
        "x1": margin.right*2,
        "y1": y(river.info.floodThreshold),
        "x2": width-margin.left*2,
        "y2": y(river.info.floodThreshold),
        "stroke-width": "2px",
        "opacity": 0.5,
        "stroke-dasharray": "10,5",
        "stroke": color("INUNDACAO")
      });
    svg.append("text")
      .attr({
        "x": margin.right*2,
        "y": y(river.info.floodThreshold) - 4,
        "fill": color("INUNDACAO"),
        "opacity": 0.5,
        "font-size": "10",
        "font-family": "sans"
      })
      .text("Nível de enchente");

    var tooltip = svg.append("g")
      .attr("class", "alert-tooltip")
      .attr("opacity", 0);
    var tooltipRect = tooltip.append("rect")
      .attr({
        "width": tooltipWidth,
        "height": tooltipHeight,
        "x": margin.left/2,
        "y": margin.top/2,
        "rx": 2,
        "ry": 2,
        "stroke": "#1878f0",
        "stroke-width": 3,
        "fill": "#1878f0",
        "opacity": 1
      });
    var tooltipText = tooltip.append("text")
      .attr({
        "x": margin.left/2 + 14,
        "y": margin.top/2 + 25,
        "fill": "#fff",
        "font-size": "8",
        "font-family": "sans"
      })
      .text("");
    var tooltipText2 = tooltip.append("text")
      .attr({
        "x": margin.left/2 + 10,
        "y": margin.top/2 + 15,
        "fill": "#fff",
        "font-size": "12",
        "font-family": "sans"
      })
      .text("");

      // svg.append("g")
      //     .attr("class", "x axis")
      //     .attr("transform", "translate(0," + height + ")")
      //     .call(xAxis);

      // svg.append("g")
      //     .attr("class", "y axis")
      //     .call(yAxis);

      var bar = svg.selectAll(".bar")
          .data(data);
        // Render bars
        bar.enter().append("rect")
          .attr("x", function(d) { return x(d.timestamp); })
          .attr("width", x.rangeBand())
          .attr("y", function(d) { return y(d.predicted); })
          .attr("height", function(d) { return height - y(d.predicted) + baseValue; })
          .attr("fill", function(d) { return color(d.predictedStatus); })
          .style("opacity", 0.4)
          .on("mouseover", function(d) {
            d3Widget.select(this).transition().duration(200).style("opacity", 1);

            var date = new Date(d.timestamp*1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            var time = hours + ':' + minutes.substr(-2);
            tooltipText.text(time);
            tooltipText2.text(d.predicted);
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            var positionX = x(d.timestamp) - tooltipWidth/2;
            var positionY = y(d.predicted) - tooltipHeight - 40;
            tooltip.attr("transform", "translate(" + positionX + "," + positionY + ")");
            })
        .on("mouseout", function(d) {
          d3Widget.select(this).transition().duration(200).style("opacity", 0.4);
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
        // Render top bars
        bar.enter().append("rect")
          .attr("width", x.rangeBand())
          .attr("x", function(d) { return x(d.timestamp); })
          .attr("y", function(d) { return y(d.predicted); })
          .attr("fill", function(d) { return color(d.predictedStatus); })
          .attr("height", 2);
        // Render time
        bar.enter().append("text")
          .attr("fill", "#fff")
          .attr("font-size", "12px")
          .attr("text-anchor", "start")
          .attr("x", function(d) { return x(d.timestamp)+x.rangeBand()+4; })
          .attr("y", height + baseValue - 5)
          .text(function(d, i) {
            var minutes = moment(d.timestamp*1000).format("mm");
            if (minutes === "00" && i !== data.length-1) {
              return moment(d.timestamp*1000).format("H:mm");
            }
        });

    function type(d) {
      d.predicted = +d.predicted;
      return d;
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

  loadScript('//d3js.org/d3.v3.min.js', function() {
    loadScript('//code.jquery.com/jquery-3.1.0.min.js', function() {
      loadScript('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/moment.min.js', function() {
        var url = getScriptUrl();
        var params = getUrlParameters(url);
        getWidgetLocation(drawWidget)
      });
    });
  });

  return Alert;
})(window);
