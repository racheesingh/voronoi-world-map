var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    var w = 1280,
    h = 800;

var projection = d3.geo.mercator()
    .scale(900)
    .translate([600, 400]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("body").insert("svg:svg", "h2")
    .attr("width", w)
    .attr("height", h);

var g = svg.append("g"),
    feature = g.selectAll(".feature");

var cells = svg.append("svg:g")
    .attr("id", "cells");

d3.json("world-countries.json", function(collection) {
  feature = feature
      .data(collection.features)
    .enter().append("path")
      .attr("class", "feature")
      .attr("d", path);
});

d3.json("server.json", function( servers ) {
    var positions = [];
    servers.forEach( function( server ) {
	positions.push( projection( [+server.location.y, +server.location.x] ) );
    });

    // Remove any duplicates from the vertices
    // geom.voronoi has undefined behaviour when duplicate vertices exist.
    sorted_positions = positions.sort();
    console.log("---");
    console.log( sorted_positions );
    console.log("---");
 
    var results = []
    for( var i = 0; i < sorted_positions.length-1; i++ ) {
	if ( sorted_positions[i][0] === sorted_positions[ i + 1 ][0] &&
	     sorted_positions[i][1] === sorted_positions[ i + 1 ][1] ) {
	    continue;
	}
	results.push( sorted_positions[i] );
	    
    }
    console.log( results );

    // Compute Voronoi diagrams for the positions
    var polygons = d3.geom.voronoi( results );

    var g1 = cells.selectAll("g")
	.data(results)
      .enter().append("svg:g"); 

    g1.append("svg:path")
	.attr("class", "cell")
	.attr("d", function(d, i) { return "M" + polygons[i].join("L") + "Z"; })

    g1.append("svg:circle")
	.attr("cx", function(d, i) { return positions[i][0]; })
	.attr("cy", function(d, i) { return positions[i][1]; })
	.attr("r", 1.5);
    
    var g2 = cells.selectAll("g")
	.data(servers)
      .enter().append("svg:g"); 

    g2.append("svg:circle")
	.attr("cx", function(d, i) { return positions[i][0]; })
	.attr("cy", function(d, i) { return positions[i][1]; })
	.attr("r", 1.5); 
});

