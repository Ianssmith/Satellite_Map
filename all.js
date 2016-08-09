
var width = 1400;
var height = 1000;
var margin = 50;
var fullangle = 2*Math.PI;


d3.csv("CSatellites.csv", function(data) {viz(data);})


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

	var earthradE = 6371/300
		var earthradN = 6357/300 

		var apogeeScale = d3.scale.linear().domain([minapogee,maxapogee]).range([minapogee/300, maxapogee/300]);
	var perigeeScale = d3.scale.linear().domain([minperigee,maxperigee]).range([minperigee/300,maxperigee/300]);
	var colorScale = d3.scale.linear().domain([0,maxInclination]).range(["#000099", "#eeeeee"]);
	var longiScale = d3.scale.linear().domain([minLongitude, maxLongitude]).range([0.0, (2*Math.PI)]);  //minperigee/300,maxperigee/300]);
	var inclinationScale = d3.scale.linear().domain([0, maxInclination]).range([50,900]);
	var radScale = d3.scale.linear().domain([minperigee, maxapogee]).range([minperigee/300, maxapogee/300]);
	var rxScale = d3.scale.linear().domain([minsemimajorA, maxsemimajorA]).range([minsemimajorA/300, maxsemimajorA/300]);
	var ryScale = d3.scale.linear().domain([minsemiminorA, maxsemiminorA]).range([minsemiminorA/300, maxsemiminorA/300]);
	var efromcenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(width/2 - minefromcenter/300), width/2 - maxefromcenter/300]);
	var reversecenterScale = d3.scale.linear().domain([minefromcenter, maxefromcenter]).range([(minefromcenter/300), maxefromcenter/300]);
	var yearScale = d3.scale.linear().domain([earliest, latest]).range([0,41000]);
	var cartxScale = d3.scale.linear().domain([rxmin, rxmax]).range([rxmin/300,rxmax/300]);
	var cartyScale = d3.scale.linear().domain([rymin, rymax]).range([rymin/300,rymax/300]);

////// CALCULATING ORBITAL PATHS vVVV

var satMatrix = {
  sec_per_longdegree: [],
  meanmotion: [],
  eccentricity: [],
  semimajorA: [],
  semiminorA: []
};

incomingData.map(function(d){
  satMatrix.sec_per_longdegree.push(d.sec_per_longdegree);
  satMatrix.meanmotion.push(d.meanmotion); 
  satMatrix.eccentricity.push(d.eccentricity);
  satMatrix.semimajorA.push(d.semimajorA);
  satMatrix.semiminorA.push(d.semiminorA);
  });



satMatrix.degrees = [];
satMatrix.timeTillX = [];
satMatrix.meanAnom = [];
satMatrix.eccentricAnom = [];
satMatrix.trueAnom = [];
satMatrix.adjustedAnom = [];
satMatrix.cartesianX = [];
satMatrix.cartesianY = [];
incomingData.degrees = [];

for(var i=1;i<=360;i++){
	satMatrix.degrees.push(i);
	incomingData.degrees.push(i);
};
console.log(incomingData.degrees);
//console.log(satellites.degrees);

satMatrix.satOrbits = []

for(var i=0;i<=1380;i++){
	satMatrix.satOrbits.push(satMatrix.degrees);
}

//VVVVVV  calculating time until give degree of orbit (in seconds) VVVVVV
    var i =0;
    var splitter = [];

    satMatrix.satOrbits.forEach(function(satellite){
      satMatrix.timeTillX.push(splitter);
      splitter = [];
      satellite.forEach(function(degree){
        splitter.push(degree*satMatrix.sec_per_longdegree[i]);
        })
        i++;
      })
satMatrix.timeTillX.shift();
//console.log(satMatrix.timeTillX);

//VVVVV   calculating mean Anomaly for each position VVVVV
    var i =0;
    var splitter = [];

    satMatrix.timeTillX.forEach(function(satellite){
      satMatrix.meanAnom.push(splitter);
      splitter = [];
      satellite.forEach(function(degree){
        splitter.push(degree*satMatrix.meanmotion[i]);
        })
        i++;
      })
      satMatrix.meanAnom.shift();

      //console.log(satMatrix.meanAnom);

// VVVVV calculating eccentric Anomaly VVVVV
    var i =0;
    var splitter = [];
    satMatrix.meanAnom.forEach(function(satellite){
      satMatrix.eccentricAnom.push(splitter);
      splitter = [];
      satellite.forEach(function(mA){
        splitter.push(mA - ((mA-(satMatrix.eccentricity[i]*Math.sin(mA))-mA)/(1-satMatrix.eccentricity[i]*Math.cos(mA))));
        })
        i++;
      })
satMatrix.eccentricAnom.shift();
      //console.log(satMatrix.eccentricAnom);

// VVVVVV true Anomaly VVVVVV
    var i =0;
    var splitter = [];
    satMatrix.eccentricAnom.forEach(function(satellite){
      satMatrix.trueAnom.push(splitter);
      splitter = [];
      satellite.forEach(function(eA){
        splitter.push(Math.acos((Math.cos(eA)-satMatrix.eccentricity[i])/(1 - (satMatrix.eccentricity[i]*Math.cos(eA)))));
        })
        i++;
      })

      satMatrix.trueAnom.shift();
      //console.log(satMatrix.trueAnom);

// VVVVVV   true Anomaly adjusted for 360degrees  VVVVVV
    var i =0;
    var splitter = [];
    satMatrix.trueAnom.forEach(function(satellite){
      satMatrix.adjustedAnom.push(splitter);
      splitter = [];
      satellite.forEach(function(degree){
        splitter.push(degree*2);
        })
        i++;
      })

      satMatrix.adjustedAnom.shift();
      //console.log(satMatrix.adjustedAnom);

//  VVVVV  converting to cartesian X coords  VVVVV
    var i =0;
    var splitter = [];
    satMatrix.adjustedAnom.forEach(function(satellite){
      satMatrix.cartesianX.push(splitter);
      splitter = [];
      satellite.forEach(function(tA){
        splitter.push(Math.cos(tA)*satMatrix.semimajorA[i]);
        })
        i++;
      })

satMatrix.cartesianX.shift();
//console.log(satMatrix.cartesianX);

// VVVVV  converting to cartesian Y coords VVVVV
    var i =0;
    var splitter = [];
    satMatrix.adjustedAnom.forEach(function(satellite){
      satMatrix.cartesianY.push(splitter);
      splitter = [];
      satellite.forEach(function(tA){
        splitter.push(Math.sin(tA)*satMatrix.semiminorA[i]);
        })
        i++;
      })

satMatrix.cartesianY.shift();


console.log(satMatrix.cartesianX);
console.log(satMatrix.cartesianY);


	var coordxmin = d3.min(satMatrix, function(el) {return el.cartesianX;});
	var coordxmax = d3.max(satMatrix, function(el) {return el.cartesianX;});

	var coordymin = d3.min(satMatrix, function(el) {return el.cartesianY;});
	var coordymax = d3.max(satMatrix, function(el) {return el.cartesianY;});

	var coordxScale = d3.scale.linear().domain([coordxmin, coordxmax]).range([coordxmin/300,coordxmax/300]);
	var coordyScale = d3.scale.linear().domain([coordymin, coordymax]).range([coordymin/300,coordymax/300]);


///// ^^^^^^

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
		.style("stroke", "red")
		.style("stroke-width", "0.25px")
		.style("opacity", 0.5);

/////VVVVV Need to FIX VVVV

d3.select("#pathHider")
  .on("click", function(){
  d3.select("#pathHider").attr("id", "pathReveal")
  d3.selectAll("ellipse")
		.transition()
		.duration(5000)
  .attr("rx", 0)
  .attr("ry", 0);
  });

d3.select("#pathReveal")
  .on("click", function(){
  d3.select("#pathReveal").attr("id", "pathHider")
  d3.selectAll("ellipse")
		.transition()
		.duration(5000)
  .attr("rx", function(d) {return rxScale(d.semimajorA);})
	.attr("ry", function(d) {return ryScale(d.semiminorA);});
  });
///// ^^^^ Need to FIX ^^^^^
	geoG.append("line")
		.attr("x1", function(d) {return reversecenterScale(d.Efromcenter);}) 
		//.attr("y1", 500/300)
		//  .attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d) {return reversecenterScale(d.Efromcenter);}) 
		.attr("y2", 500/300)
    .style("stroke", "white")
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
		//  .attr("cy", 500/300)
		//  .attr("cx", 0)
		.attr("cy", 0)
    .style("stroke","white")
    .style("fill","white")
		.transition()
		.delay(function(d,i) {return yearScale(d.launch_year)})
		.duration(5000)
		.attr("cx", function(d) {return cartxScale(d.cartX);})
		.attr("cy", function(d) {return cartyScale(d.cartY);})
		//.attr("cx", function(d) {
    //
    //return coordxScale(d.cartesianX);})
		//.attr("cy", function(d) {
    //
    //return coordyScale(d.cartesianY);})
		.attr("r", 1)//function(d) {return d.inclination;})
		.style("stroke", "white")
		.style("fill", "none")
    .style("stroke-width", "0.25px");

  //for(var i = 0; i<satMatrix.cartesianX.length; i++){
  //if(i == satMatrix.cartesianX.length){
    //i = 0;
    //}
		//d3.selectAll("g.satellites").select("circle").transition().duration(1000)
    //.data(satMatrix)
    //.attr("cx", function(d,i) {return coordxScale(d.cartesianX[i]);})
    //.attr("cy", function(d,i) {return coordyScale(d.cartesianY[i]);});
  //}
//function update(datax, datay){
//
// var animate = geoG.selectAll("circle") 
//    .data(datax, function(d) {return d});
//
//    animate.attr("cx", function(d,i,j) {return coordxScale(j);})
//
//    var animate = geoG.selectAll("circle")
//    .data(datay, function(d) {return d});
//
//    animate.attr("cy", function(d,i,j) {return coordyScale(j);})
//}

//update(satMatrix.cartesianX, satMatrix.cartesianY)

	/*
		 var projection = d3.geo.orthographic()
		 .translate([width/2, height/2])
		 .clipAngle(90+1e-6)
		 .precision(.3);

		 var earth = d3.geo.path()
		 .projection(earth);

		 var graticule = d3.geo.graticule();

		 d3.select("svg")
		 .append("earth")
		 .datum({type: "Sphere"})
		 .attr("d", earth)
		 .datum(graticule)
		 .attr("stroke", "green")
		 .attr("d", earth)
		 .datum({type: "LineString", coordinates: [[-180,0], [-90,0],[0,0], [90,0], [180,0]]})
		 .attr("d", earth);
	 */

	var projection = d3.geo.orthographic()
		.scale(earthradE - 2)
		.translate([width/2, height/2])
		.clipAngle(90)
		.rotate([10,0,0]);


	var canvas = d3.select("svg").append("canvas")
		.attr("width", width)
		.attr("height", height);
	console.info(d3.select("svg"));
	var path = d3.geo.path()
		.projection(projection);

	d3.json("./world-110m.json", function(error, world) {
			var land = topojson.object(world, world.objects.land),
			globe = {type: "Sphere"};
			context = canvas.node().getContext("2d");

			context.strokeStyle = '#766951';

			context.fillStyle = '#d8ffff';
			context.beginPath(), path.context(context)(globe), context.fill(), context.stroke();

			context.fillStyle = '#d7c7ad';
			context.beginPath(), path.context(context)(land), context.fill(), context.stroke();
			});

	///^^^

	d3.select("svg")
		.append("ellipse")
		.attr("rx", earthradE)
		.attr("ry", earthradN)
		.attr("cx", width/2)
		.attr("cy", height/2)
		.style("fill", "lightblue")
		.style("stroke", "green")

	//	geoG.append("text")
	//	.text(function(d) {return d.launch_year;}) //{return d.country + "-" + d.launch_year;})
	//	.attr("x", function(d) {return reversecenterScale(d.Efromcenter);}) 
	//	.attr("y", 0)
  //  .style("fill","white")
	//	.transition()
	//	.delay(function(d,i) {return yearScale(d.launch_year)})
	//	.duration(5000)
	//	.attr("x", function(d) {return cartxScale(d.cartX);})
	//	.attr("y", function(d) {return cartyScale(d.cartY);})

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




//d3.json("orbitalCoords.json", function(coords) {animate(coords);})
//
//function animate(incomingCoords){
//
//
//	var coordxmin = d3.min(incomingCoords, function(el) {return el.Xcoords;});
//	var coordxmax = d3.max(incomingCoords, function(el) {return el.Xcoords;});
//
//	var coordymin = d3.min(incomingCoords, function(el) {return el.Ycoords;});
//	var coordymax = d3.max(incomingCoords, function(el) {return el.Ycoords;});
//
//	var coordxScale = d3.scale.linear().domain([coordxmin, coordxmax]).range([coordxmin/300,coordxmax/300]);
//	var coordyScale = d3.scale.linear().domain([coordymin, coordymax]).range([coordymin/300,coordymax/300]);
//
//  d3.select("svg")
//  d3.selectAll("g.satellites")
//    .data(incomingCoords)
//    .selectAll("circle")
//    .attr("cx", function(d,i) {return coordxScale(d.Xcoord);})
//    .attr("cy", function(d,i) {return coordyScale(d.Ycoord);})
//
//  }
}
