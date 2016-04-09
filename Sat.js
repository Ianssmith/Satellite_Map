function findMax(arr){
  var max = arr[0];
  for(i=0;i<arr.length;i++){
    if(arr>max){
      max = arr[i];
    }
  }
  return max;
}

function findMin(arr){
  var min = arr[0];
  for(i=0;i<arr.length;i++){
    if(arr<min){
      min = arr[i];
    }
  }
  return min;
}


data = d3.csv("CSatellites.csv", function(data) {viz(data);});


 function viz(incomingData){

  d3.select("body").selectAll("div.satellites")
    .data(incomingData)
    .enter()
    .append("div")
    .attr("class", "satellites")
    .html(function(d,i) {return d.name;});
  

var maxInclination = d3.max(incomingData, function(el) {return el.inclination;});
var maxLongitude = d3.max(incomingData, function(el) {return el.longitude;});
var minLongitude = d3.min(incomingData, function(el) {return el.longitude;});

var radiusScale = d3.scale.linear().domain([200,330000]).range([5,300]);
var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([700,2000]);
var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,1000]);

d3.select("svg")
  .selectAll("ellipse")
  .data(incomingData)
  .enter()
  .append("ellipse")
  .attr("rx", function(d) {return radiusScale(d.apogee_km);})
  .attr("ry", function(d) {return radiusScale(d.perigee_km);})
  .attr("cx", function(d) {return inclinationScale(d.inclination);})
  .attr("cy", function(d) {return longiScale(d.longitude);})
  .style("fill", function(d) {return colorScale(d.inclination);})
  .style("stroke", "red")
  .style("stroke-width", "0.5px")
  .style("opacity", .35)


}
