

data = d3.csv("LEO_sun.csv", function(data) {viz(data);});


 function viz(incomingData){


var maxapo = d3.max(incomingData, function(el) {return el.apogee_km;});
var minapo = d3.min(incomingData, function(el) {return el.apogee_km;});
//var maxInclination = d3.

var radiusScale = d3.scale.linear().domain([200,1400]).range([5,600]);
var colorScale = d3.scale.linear().domain([minapo, maxapo]).range(["#000099", "#eeeeee"]);
//var inclinationScale = d3.scale.linear().domain([minInclination, maxInclination]).range([50,1000]);

var Sat = d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("transform", function(d) {return "translate(" + 500 + "," + 500 + ")";
});


  Sat.append("ellipse")
  .attr("rx", function(d) {return radiusScale(d.apogee_km);})
  .attr("ry", function(d) {return radiusScale(d.perigee_km);})
  .style("fill", "none")//function(d) {return colorScale(d.inclination);})
  .style("stroke", "blue")
  .style("stroke-width", "0.5px")
  .style("opacity", .50)

Sat.append("text")
  .text(function(d) {return d.country + "-" + d.name;});
}
