var width = 1000;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;


data = d3.csv("LEO_sun.csv", function(data) {viz(data);})


 function viz(incomingData){


var maxInclination = d3.max(incomingData, function(el) {return el.inclination;});
var maxLongitude = d3.max(incomingData, function(el) {return el.longitude;});
var minLongitude = d3.min(incomingData, function(el) {return el.longitude;});
var minapogee = d3.min(incomingData, function(el) {return el.apogeeR;});
var maxapogee = d3.max(incomingData, function(el) {return el.apogeeR;});
var minperigee = d3.min(incomingData, function(el) {return el.perigeeR;});
var maxperigee = d3.max(incomingData, function(el) {return el.perigeeR;});

var minsemimajorA = d3.min(incomingData, function(el) {return el.semimajorA;});
var maxsemimajorA = d3.max(incomingData, function(el) {return el.semimajorA;});

var minsemiminorA = d3.min(incomingData, function(el) {return el.semiminorA;});
var maxsemiminorA = d3.max(incomingData, function(el) {return el.semiminorA;});

var rxmin = d3.min(incomingData, function(el) {return el.cartX;});
var rxmax = d3.max(incomingData, function(el) {return el.cartX;});

var rymin = d3.min(incomingData, function(el) {return el.cartY;});
var rymax = d3.max(incomingData, function(el) {return el.cartY;});

var minefromcenter = d3.min(incomingData, function(el) {return el.Efromcenter;});
var maxefromcenter = d3.max(incomingData, function(el) {return el.Efromcenter;});

var earliest = d3.min(incomingData, function(el) {return el.launch_year;});
var latest = d3.max(incomingData, function(el) {return el.launch_year;});

var earthradE = 6371/25
var earthradN = 6357/25 

var apogeeScale = d3.scale.linear().domain([minapogee,maxapogee]).range([minapogee/25, maxapogee/25]);
var perigeeScale = d3.scale.linear().domain([minperigee,maxperigee]).range([minperigee/25,maxperigee/25]);
var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([0.0, (2*Math.PI)]);  //minperigee/250,maxperigee/250]);
var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,900]);
var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/25, maxapogee/25]);
var rxScale = d3.scale.linear().domain([minsemimajorA, maxsemimajorA]).range([minsemimajorA/25, maxsemimajorA/25]);
var ryScale = d3.scale.linear().domain([minsemiminorA, maxsemiminorA]).range([minsemiminorA/25, maxsemiminorA/25]);
var efromcenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(width/2 - minefromcenter/25), width/2 - maxefromcenter/25]);
var reversecenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(minefromcenter/300), maxefromcenter/300]);
var yearScale = d3.scale.linear().domain([earliest, latest]).range([0,41000]);

var cartxScale = d3.scale.linear().domain([rxmin, rxmax]).range([rxmin/25,rxmax/25]);
var cartyScale = d3.scale.linear().domain([rymin, rymax]).range([rymin/25,rymax/25]);

var Sat = d3.select("svg")
    .selectAll("g")
    .data(incomingData)
    .enter()
    .append("g")
    .attr("class", "satellites")
    .attr("transform", function(d) {return "translate(" + (efromcenterScale(d.Efromcenter)) + "," + height/2 + ")";
});


var geoG = d3.selectAll("g.satellites");

  geoG.append("ellipse")
  .attr("rx", 0)
  .attr("ry", 0)
  .transition()
  .delay(function(d,i) {return yearScale(d.launch_year)})
  .duration(5000)
  .attr("rx", function(d) {return rxScale(d.semimajorA);})
  .attr("ry", function(d) {return ryScale(d.semiminorA);})
  //.attr("cx", function(d) {return inclinationScale(d.inclination);})
  //.attr("cy", function(d) {return longiScale(d.longitude);})
  .style("fill", "transparent")//function(d) {return colorScale(d.inclination);})
  .style("stroke", "#d46a6a")
  .style("stroke-width", "0.5px")
  .style("opacity", 0.5);

geoG.append("line")
  .attr("x1", function(d) {return reversecenterScale(d.Efromcenter);}) 
  .attr("y1", 0)
  .attr("x2", function(d) {return reversecenterScale(d.Efromcenter);}) 
  .attr("y2", 500/25)
  .transition()
  .delay(function(d,i) {return yearScale(d.launch_year)})
  .duration(5000)
  .attr("x2", function(d) {return cartxScale(d.cartX);})
  .attr("y2", function(d) {return cartyScale(d.cartY);})
  .style("stroke", "red")
  .style("stroke-width", "0.5px")
  .style("opacity", 0.5);

geoG.append("circle")
  .attr("cx", function(d) {return reversecenterScale(d.Efromcenter);}) 
  .attr("cy", 0)
  .transition()
  .delay(function(d,i) {return yearScale(d.launch_year)})
  .duration(5000)
  .attr("cx", function(d) {return cartxScale(d.cartX);})
  .attr("cy", function(d) {return cartyScale(d.cartY);})
  .attr("r", 3)//function(d) {return d.inclination;})
  .style("stroke", "grey")
  .style("fill", "lightblue");


d3.select("svg")
    .append("ellipse")
    .attr("rx", earthradE)
    .attr("ry", earthradN)
    .attr("cx", width/2)
    .attr("cy", height/2)
    .style("fill", "white")
    .style("stroke", "green")

//geoG.append("text")
//  .text(function(d) {return d.country + "-" + d.name;})
//  .attr("y", function(d) {return ryScale(d.cartY);})
//  .attr("x", function(d) {return rxScale(d.cartX);})

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
