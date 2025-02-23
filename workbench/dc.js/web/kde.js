// Based on http://bl.ocks.org/900762 by John Firebaugh
function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

var science = function(){return 1;}

loadScript("js/science.v1.js", science)


d3.json("faithful.json", function(faithful) {
  data = faithful;
  var w = 800,
      h = 400,
      x = d3.scale.linear().domain([30, 110]).range([0, w]);
      bins = d3.layout.histogram().frequency(false).bins(x.ticks(60))(data),
      max = d3.max(bins, function(d) { return d.y; }),
      y = d3.scale.linear().domain([0, .1]).range([0, h]),
      kde = science.stats.kde().sample(data);

  var vis = d3.select("body")
    .append("svg")
      .attr("width", w)
      .attr("height", h);

  var bars = vis.selectAll("g.bar")
      .data(bins)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) {
        return "translate(" + x(d.x) + "," + (h - y(d.y)) + ")";
      });

  bars.append("rect")
      .attr("fill", "steelblue")
      .attr("width", function(d) { return x(d.dx + 30) - 1; })
      .attr("height", function(d) { return y(d.y); });

  var line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) { return h - y(d[1]); });

  vis.selectAll("path")
      .data(d3.values(science.stats.bandwidth))
    .enter().append("path")
      .attr("d", function(h) {
        return line(kde.bandwidth(h)(d3.range(30, 110, .1)));
      });
});
