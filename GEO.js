var width = 1000;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;

data = d3.csv("GEO.csv", function(data) {viz(data);})


 function viz(incomingData){


var maxInclination = d3.max(incomingData, function(el) {return el.inclination;});
var maxLongitude = d3.max(incomingData, function(el) {return el.longitude;});
var minLongitude = d3.min(incomingData, function(el) {return el.longitude;});
var minapogee = d3.min(incomingData, function(el) {return el.apogee_km;});
var maxapogee = d3.max(incomingData, function(el) {return el.apogee_km;});
var minperigee = d3.min(incomingData, function(el) {return el.perigee_km;});
var maxperigee = d3.max(incomingData, function(el) {return el.perigee_km;});
var earthradE = 6371/100
var earthradN = 6357/100 

var apogeeScale = d3.scale.linear().domain([minapogee,maxapogee]).range([minapogee/100, maxapogee/100]);
var perigeeScale = d3.scale.linear().domain([minperigee,maxperigee]).range([minperigee/100,maxperigee/100]);
var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([0.0, (2*Math.PI)]);  //minperigee/100,maxperigee/100]);
var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,900]);
var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/100, maxapogee/100]);

d3.select("svg")
    .append("ellipse")
    .attr("rx", earthradE)
    .attr("ry", earthradN)
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("fill", "lightblue")
    .style("stroke", "green")

var Sat = d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "satellites")
    .attr("transform", function(d) {return "translate(" + width/2  + "," + height/2 + ")";
});


var geoG = d3.selectAll("g.satellites");

  geoG.append("ellipse")
  .attr("rx", 0)
  .attr("ry", 0)
  .transition()
  .delay(function(d,i) {return i * 100})
  .duration(500)
  .attr("rx", function(d) {return apogeeScale(d.apogee_km);})
  .attr("ry", function(d) {return perigeeScale(d.perigee_km);})
  //.attr("cx", function(d) {return inclinationScale(d.inclination);})
  //.attr("cy", function(d) {return longiScale(d.longitude);})
  .style("fill", "none")//function(d) {return colorScale(d.inclination);})
  .style("stroke", "#d46a6a")
  .style("stroke-width", "0.5px")
  .style("opacity", .50)

geoG.append("text")
  .text(function(d) {return d.country + "-" + d.name;})
  .attr("y", function(d) {return perigeeScale(d.perigee_km) - longiScale(d.longitude*2);})

var dataKeys = d3.keys(incomingData[0]).filter(function(el){
    return el == "power_watts" || el == "inclination";
});

d3.select("#controls").selectAll("button.satellites")
    .data(dataKeys).enter()
    .append("button")
    .on("click", buttonClick)
.html(function(d) {return d;});

function buttonClick(datapoint){
    var maxValue = d3.max(incomingData, function(d){
        return parseFloat(d[datapoint]);
});
var radiusScale = d3.scale.linear()
    .domain([ 0, maxValue]).range([2,200]);

d3.selectAll("g.satellites").select("ellipse").transition().duration(1000)
    .attr("rx", function(d){
        return radiusScale(d[datapoint]);
    })
    .attr("ry", function(d) {
        return radiusScale(d[datapoint]);
    });
};

d3.text("table.html", function(data) {
    d3.select("body").append("div").attr("id", "modal").html(data);
});

geoG.on("click", clickButton);

function clickButton(d){
   d3.selectAll("td.data").data(d3.values(d))
      .html(function(p) {
         return p 
      })
   }


}
