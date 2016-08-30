var Alert = (function(window, undefined) {
  var Alert = {};

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

  function getData(params, callback) {
    Alert.$ = Alert.jQuery = jQuery.noConflict(true);

    var timestamp = parseInt(params.timestamp);

    $.ajax({
      method: "GET",
      url: "http://alertas-enchentes-api.herokuapp.com/station/"+params.station+"/prediction",
      data: {},
      sucess: function(river) {
        callback(river, timestamp);
      },
      error: function(error) {
        console.log(error);
        // var river = JSON.parse('{"info":{"id":13600002,"name":"Rio Madeira","warningThreshold":1350,"floodThreshold":1400},"data":[{"timestamp":1472571900,"measured":163,"predicted":171,"measuredStatus":"NORMAL","predictedStatus":"NORMAL"},{"timestamp":1472574600,"measured":null,"predicted":170,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472575500,"measured":null,"predicted":169,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472576400,"measured":null,"predicted":162,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472577300,"measured":null,"predicted":164,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472578200,"measured":null,"predicted":167,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472579100,"measured":null,"predicted":163,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472580000,"measured":null,"predicted":168,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472580900,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472581800,"measured":null,"predicted":165,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472582700,"measured":null,"predicted":165,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472583600,"measured":null,"predicted":168,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472584500,"measured":null,"predicted":163,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472585400,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472586300,"measured":null,"predicted":160,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472587200,"measured":null,"predicted":168,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472588100,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472589000,"measured":null,"predicted":162,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472589900,"measured":null,"predicted":162,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472590800,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472591700,"measured":null,"predicted":162,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472592600,"measured":null,"predicted":157,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472593500,"measured":null,"predicted":160,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472594400,"measured":null,"predicted":154,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472595300,"measured":null,"predicted":154,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472596200,"measured":null,"predicted":159,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472597100,"measured":null,"predicted":154,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472598000,"measured":null,"predicted":149,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472598900,"measured":null,"predicted":162,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472599800,"measured":null,"predicted":154,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472600700,"measured":null,"predicted":153,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472601600,"measured":null,"predicted":151,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472602500,"measured":null,"predicted":157,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472603400,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472604300,"measured":null,"predicted":152,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472605200,"measured":null,"predicted":151,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472606100,"measured":null,"predicted":159,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472607000,"measured":null,"predicted":161,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472607900,"measured":null,"predicted":158,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472608800,"measured":null,"predicted":163,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472609700,"measured":null,"predicted":151,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472610600,"measured":null,"predicted":153,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472611500,"measured":null,"predicted":157,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472612400,"measured":null,"predicted":158,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472613300,"measured":null,"predicted":157,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472614200,"measured":null,"predicted":158,"measuredStatus":null,"predictedStatus":"NORMAL"},{"timestamp":1472615100,"measured":null,"predicted":156,"measuredStatus":null,"predictedStatus":"NORMAL"}]}');
        // callback(river, timestamp);
      }
    });
  }

  function getAlertTimestamp(river) {
    if (!river) return;
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

  function drawWidget(river, timestamp) {
    if (!river) return;

    var data = river.data;

    var margin = {
          top: 50,
          right: 10,
          bottom: 100,
          left: 10
        },
        width = 600 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom,
        viewBoxWidth = width + margin.left + margin.right,
        viewBoxHeight = height + margin.top + margin.bottom,
        baseValue = 100,
        tooltipWidth = 50,
        tooltipHeight = 30;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0);
    var y = d3.scale.linear()
        .range([height, 0]);
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    x.domain(data.map(function(d) { return d.timestamp; }));
    y.domain([d3.min(data, function(d) { return d.predicted; }), d3.max(data, function(d) { return d.predicted; })]);

    //Get alert info
    var alertTimestamp = getAlertTimestamp(river);
    var alertHour = null
    if (alertTimestamp.timestamp !== null) {
      var date = new Date(alertTimestamp.timestamp*1000);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      alertHour = hours + ':' + minutes.substr(-2);
    }

    var mapInfo = d3.select("#alerta-enchentes")
      .append("div")
        .attr("class", "alerta-enchentes-map-info")
        .style({
          "width": "678px",
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
        .style({
          "float": "left"
        })
        .append("div");
      if (alertHour !== null) {
        alertInfo.append("div")
        .style({
          "float": "left",
          "margin-top": "10px",
          "margin-right": "12px",
          "font-size": "60px"
        })
        .append("span")
        .html(alertHour);
      }
      var alertInfoText = alertInfo.append("div")
        .style({
          "float": "left",
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
      var graph = mapInfo.append("div")
        .attr("class", "alerta-enchentes-graph");

    // Graph
    var svg = graph.append("svg")
        .attr("width", "100%")
        .attr("viewBox", "0 0 "+viewBoxWidth+" "+viewBoxHeight)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var domainMin = d3.min(data, function(d) { return d.predicted; });
    var domainMax = d3.max(data, function(d) { return d.predicted; });
    if (domainMax < river.info.floodThreshold) {
        var domainMax = river.info.floodThreshold;
    }
    x.domain(data.map(function(d) { return d.timestamp; }));
    y.domain([domainMin, domainMax]);

    // Draw lines
    svg.append("line")
      .attr({
        "x1": 0,
        "y1": y(river.info.warningThreshold),
        "x2": width+10,
        "y2": y(river.info.warningThreshold),
        "fill": "none",
        "stroke-width": "2px",
        "opacity": 1,
        "stroke-dasharray": "10,5",
        "stroke": color("ALERTA")
      });
    svg.append("text")
      .attr({
        "x": 0,
        "y": y(river.info.warningThreshold) + 12,
        "fill": color("ALERTA"),
        "font-size": "10",
        "font-family": "sans"
      })
      .text("Nível de alerta");
    svg.append("line")
      .attr({
        "fill": "none",
        "x1": 0,
        "y1": y(river.info.floodThreshold),
        "x2": width+10,
        "y2": y(river.info.floodThreshold),
        "stroke-width": "2px",
        "opacity": 1,
        "stroke-dasharray": "10,5",
        "stroke": color("INUNDACAO")
      });
    svg.append("text")
      .attr({
        "x": 0,
        "y": y(river.info.floodThreshold) - 4,
        "fill": color("INUNDACAO"),
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
            d3.select(this).transition().duration(200).style("opacity", 1);

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
          d3.select(this).transition().duration(200).style("opacity", 0.4);
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
            console.log();
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
        loadScript('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.14.1/locale/br.js', function() {
          var url = getScriptUrl();
          var params = getUrlParameters(url);
          getData(params, drawWidget);
        });
      });
    });
  });

  return Alert;
})(window);
