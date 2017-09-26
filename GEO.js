var width = 1400;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;

var years = [];
for(i=1974;i<=2015;i++){
	years.push(i);
};
console.log(years);

d3.csv("GEO.csv", function(data) {viz(data);})


function viz(incomingData){
	console.log(incomingData);

//var orbitData = 


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

	var earthradE = 6371/100
		var earthradN = 6357/100 

		var apogeeScale = d3.scale.linear().domain([minapogee,maxapogee]).range([minapogee/100, maxapogee/100]);
	var perigeeScale = d3.scale.linear().domain([minperigee,maxperigee]).range([minperigee/100,maxperigee/100]);
	var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
	var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([0.0, (2*Math.PI)]);  //minperigee/100,maxperigee/100]);
	var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,900]);
	var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/100, maxapogee/100]);
	var rxScale = d3.scale.linear().domain([minsemimajorA, maxsemimajorA]).range([minsemimajorA/100, maxsemimajorA/100]);
	var ryScale = d3.scale.linear().domain([minsemiminorA, maxsemiminorA]).range([minsemiminorA/100, maxsemiminorA/100]);
	var efromcenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(width/2 - minefromcenter/100), width/2 - maxefromcenter/100]);
	var reversecenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(minefromcenter/100), maxefromcenter/100]);
	var yearScale = d3.scale.linear().domain([earliest, latest]).range([0,41000]);
	var cartxScale = d3.scale.linear().domain([rxmin, rxmax]).range([rxmin/100,rxmax/100]);
	var cartyScale = d3.scale.linear().domain([rymin, rymax]).range([rymin/100,rymax/100]);

	var Sat = d3.select("svg")
    .style("background", "black")
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
    .style("stroke", "white")
		.transition()
		.delay(function(d,i) {return yearScale(d.launch_year)})
		.duration(5000)
		.attr("rx", function(d) {return rxScale(d.semimajorA);})
		.attr("ry", function(d) {return ryScale(d.semiminorA);})
		//.attr("cx", function(d) {return inclinationScale(d.inclination);})
		//.attr("cy", function(d) {return longiScale(d.longitude);})
		.style("fill", "none")//function(d) {return colorScale(d.inclination);})
		.style("stroke", "#FE0000")
		.style("stroke-width", "0.25px")
		.style("opacity", 0.5);

	geoG.append("line")
		.attr("x1", function(d) {return reversecenterScale(d.Efromcenter);}) 
		//.attr("y1", 500/100)
		//  .attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d) {return reversecenterScale(d.Efromcenter);}) 
		.attr("y2", 500/100)
    .style("stroke", "white")
		.transition()
		.delay(function(d,i) {return yearScale(d.launch_year)})
		.duration(5000)
		.attr("x2", function(d) {return cartxScale(d.cartX);})
		.attr("y2", function(d) {return cartyScale(d.cartY);})
		.style("stroke", "#FE0000")
		.style("stroke-width", "0.5px")
		.style("opacity", 0.5);

	var SS = geoG.append("circle")
		.attr("cx", function(d) {return reversecenterScale(d.Efromcenter);}) 
		//  .attr("cy", 500/100)
		//  .attr("cx", 0)
		.attr("cy", 0)
    .style("stroke","white")
    .style("fill","white")
		.transition()
		.delay(function(d,i) {return yearScale(d.launch_year)})
		.duration(5000)
		.attr("cx", function(d) {return cartxScale(d.cartX);})
		.attr("cy", function(d) {return cartyScale(d.cartY);})
		.attr("r", 1)//function(d) {return d.inclination;})
		.style("stroke", "white")
		.style("fill", "none")
    .style("stroke-width", "0.25px");


var velocity = 0.001;
var time = Date.now();

	var projection = d3.geo.orthographic()
		.scale(earthradE - 2)
		.translate([width/2, height/2])
		.clipAngle(90)
		//.precision(0.1);
		.rotate([10,0,0]);


	//var canvas = d3.select("svg").append("canvas")
		//.attr("width", width)
		//.attr("height", height);
	//console.info(d3.select("svg"));
	var path = d3.geo.path()
		.projection(projection);

	var graticule = d3.geo.graticule();

	d3.select("svg")
		.append("defs").append("path")
		.datum({type: "Sphere"})
		.attr("id", "sphere")
		.attr("d",path);

	d3.select("svg")
		.append("use")
		.attr("class", "stroke")
		.attr("xlink:href", "#sphere");

	d3.select("svg")
		.append("use")
		.attr("class", "fill")
		.attr("xlink:href", "#sphere");

	d3.select("svg")
		.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);

	d3.select("svg")
	

	d3.json("world-50m.json", function(error, world) {
		if(error) throw error;

		d3.select("svg")
			.insert("path", ".graticule")
			.datum(topojson.feature(world, world.objects.land))
			.attr("class", "land")
			.attr("d", path)

		d3.select("svg")
			.insert("path", ".graticule")
			.datum(topojson.mesh(world, world.objects.countries, function (a,b){return a!==b;}))
			.attr("class", "boundary")
			.attr("d", path);


			});
		d3.timer(function(){
			var dt = Date.now() - time;
			projection.rotate([velocity*dt,-90])
			//projection.rotate([velocity*dt]);
			//projection.rotate([velocity*dt,-velocity*dt]);
			d3.select("svg").selectAll("path").attr("d",path);
		})

	//var earth = d3.select("svg")
	//	.append("ellipse")
	//	.attr("rx", earthradE)
	//	.attr("ry", earthradN)
	//	.attr("cx", width/2)
	//	.attr("cy", height/2)
	//	.style("fill", "lightblue")
	//	.style("stroke", "green")

		//d3.select("svg")
		//.append("line")
		//.attr("x1", width/2)
		//.attr("y1", height/2-earthradN)
		//.attr("x2", width/2)
		//.attr("y2", height/2+earthradN)
		//.style("stroke", "green")
		//.style("stroke-width", "0.5px")


		//geoG.append("text")
		//.attr("x", 475)
		//.attr("y", 90)
		//.text(function(d){return d.country + "-" + d.launch_year;})

		/*
			 geoG.append("text")
			 .text(function(d) {return d.launch_year;}) //{return d.country + "-" + d.launch_year;})
			 .attr("x", function(d) {return reversecenterScale(d.Efromcenter);}) 
			 .attr("y", 0)
			 .transition()
			 .delay(function(d,i) {return yearScale(d.launch_year)})
			 .duration(5000)
			 .attr("x", function(d) {return cartxScale(d.cartX);})
			 .attr("y", function(d) {return cartyScale(d.cartY);})
		//  .attr("y", function(d) {return ryScale(d.cartY);})
		//  .attr("x", function(d) {return rxScale(d.cartX);})
		 */

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

	//d3.text("table.html", function(data) {
	//		d3.select("body").append("div").attr("id", "table").html(data);
	//		});

	//geoG.on("mouseover", mouseHover);

	//function mouseHover(d){
	//	d3.selectAll("td.data").data(d3.values(d))
	//		.html(function(p) {
	//				return p 
	//				})
	//}


}



