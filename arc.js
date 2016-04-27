var width = 1000;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;
var earthradE = 6371/100
colors = d3.scale.category20();


data = d3.csv("GEO.csv", function(data) {viz(data);})

 function viz(incomingData){
var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/100, maxapogee/100]);
var maxapogee = d3.max(incomingData, function(el) {return el.apogee_km;});
var minperigee = d3.min(incomingData, function(el) {return el.perigee_km;});

   var svg = d3.select("body").append("svg")
               .attr("class", "pie")
               .attr("height", height)
               .attr("width", width);


function render(earthRad, satlong){
  if(!satlong) satlong = fullangle;

var arc = d3.svg.arc().outerRadius(function(d) {return radScale(d.radii);})
    .innerRadius(earthRad);

svg.select("g").remove();

svg.append("g")
  .attr("transform", "translate(500,500)")
  .selectAll("path.arc")
    .data(incomingData)
  .enter()
    .append("path")
      .attr("class", "arc")
.attr("fill", function(d, i){return colors(i);})
                .attr("d", function(d, i){
                    return arc(d, i); 
                });

}

render(earthradE, function(d) {return d.radians});


}
