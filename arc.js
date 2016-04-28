var width = 1000;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;
var earthradE = 6371/100;
colors = d3.scale.category20();


data = d3.csv("GEO.csv", function(data) {viz(data);})

function viz(incomingData){

var pie = d3.layout.pie(incomingData)
		.value(function (d) { return d.radians; })
	//	.outerRadius(function(d) {return d.radii;})

	var maxapogee = d3.max(incomingData, function(el) {return el.apogee_km;});
	var minperigee = d3.min(incomingData, function(el) {return el.perigee_km;});
	var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/100, maxapogee/100]);
	

var arc = d3.svg.arc()
	.innerRadius(earthradE)
	.outerRadius(500);	//function(d,i) {return d.incomingData.radii;});

	var svg = d3.selectAll("svg")
		//.append("g")
		.attr("height", height)
		.attr("width", width)

		var arcs = svg.selectAll("g.arc")
			.data(pie(incomingData))
			.enter()
			.append("g")
			//.attr('stroke', 'black')
			.attr("class", "arc")
			.attr("transform", "translate( 500,500)");

		arcs.append("path")
			.attr("stroke", "red")
			.attr("fill", "black")
			.style("stroke-width", 0.5)
			.style("opacity", .25)
			.attr("d", arc)

		.transition().duration(3000)
    .attrTween("d", function (d) { 
        var start = {startAngle: 0, endAngle: 0}; 
        var interpolate = d3.interpolate(start, d);
        return function (t) {
            return arc(interpolate(t));  
        };
});

}
