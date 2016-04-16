

data = d3.csv("GEO.csv", function(data) {viz(data);});


 function viz(incomingData){


var maxInclination = d3.max(incomingData, function(el) {return el.inclination;});
var maxLongitude = d3.max(incomingData, function(el) {return el.longitude;});
var minLongitude = d3.min(incomingData, function(el) {return el.longitude;});

var radiusScale = d3.scale.linear().domain([3200,39000]).range([5,50]);
var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([450,575]);
var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,900]);

var Sat = d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("transform", function(d) {return "translate(" + longiScale(d.longitude) + "," + inclinationScale(d.inclination) + ")";
});


  Sat.append("ellipse")
  .attr("rx", function(d) {return radiusScale(d.apogee_km);})
  .attr("ry", function(d) {return radiusScale(d.perigee_km);})
  //.attr("cx", function(d) {return inclinationScale(d.inclination);})
  //.attr("cy", function(d) {return longiScale(d.longitude);})
  .style("fill", "none")//function(d) {return colorScale(d.inclination);})
  .style("stroke", "green")
  .style("stroke-width", "0.5px")
  .style("opacity", .50)

Sat.append("text")
  .text(function(d) {return d.country + "-" + d.name;});
}
