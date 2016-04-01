data = d3.csv("CSatellites.csv", function(data) {viz(data);});
 function viz(satData){
  d3.select("body").selectAll("div.names")
    .data(satData)
    .enter()
    .append("div")
    .attr("class", "names")
    .html(function(d,i) {return d.name;});
  }
