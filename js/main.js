setTimeout(function() { $('a[href="http://www.amcharts.com/javascript-charts/"]').remove(); }, 500);

async.map([
	"data/violent_titles.csv",
	"data/turkey_refugees.csv",
	"data/jordan_refugees.csv",
	"data/iraq_refugees.csv",
	"data/egypt_refugees.csv",
	"data/num_refugees_over_time.csv",
	"data/violent_titles.csv"
], d3.csv, function(error, results) {
	if (error) return console.error(error);

	var violent_events_data = results[0];

	var turkey_refugee_data = results[1];
	var jordan_refugee_data = results[2];
	var iraq_refugee_data   = results[3];
	var egypt_refugee_data  = results[4];

	var num_refugees_data = results[5];
	var violent_titles_data = results[6];

	var date_format1 = d3.time.format("%Y%m%d");
	var date_format2 = d3.time.format("%y/%m/%d");
	var date_format3 = d3.time.format("%m/%d/%Y");
	var date_format4 = d3.time.format("%y/%m");
	var date_format5 = d3.time.format("%b %d, %Y");
	var date_format6 = d3.time.format("%b \'%y");
	var date_format7 = d3.time.format("%Y");

	violent_events_data.sort(function(a, b) { return parseInt(a["DATE"]) - parseInt(b["DATE"]); });

	first_index = {};
	last_index = {};

	violent_events_count_by_location = {};

	for (var i = 0; i < violent_events_data.length; i++) {
		if (first_index[violent_events_data[i]["DATE"]] === undefined)
			first_index[violent_events_data[i]["DATE"]] = i;

		if (i == violent_events_data.length) {
			last_index[violent_events_data[i]["DATE"]] = i;
			break;
		}

		if (i < violent_events_data.length - 1 && violent_events_data[i]["DATE"] != violent_events_data[i + 1]["DATE"])
			last_index[violent_events_data[i]["DATE"]] = i;
	}


	var violent_events_bar_chart   = dc.barChart("#dc-violent-events");
	var all_refugees_area_chart    = dc.lineChart("#dc-refugees-all");
	var turkey_refugees_area_chart = dc.lineChart("#dc-refugees-turkey");
	var jordan_refugees_area_chart = dc.lineChart("#dc-refugees-jordan");
	var iraq_refugees_area_chart   = dc.lineChart("#dc-refugees-iraq");
	var egypt_refugees_area_chart  = dc.lineChart("#dc-refugees-egypt");
	var dataTable = dc.dataTable("#dc-table-graph");

	var violent_events = crossfilter(violent_events_data);

	var violent_events_date  = violent_events.dimension(function(d) { return date_format1.parse(d["DATE"]); });
	var violent_events_count = violent_events.dimension(function(d) { return +d["COUNT"]; });
	var violent_events_date_group = violent_events_date.group();

	violent_events_bar_chart.margins({top: 10, right: 10, bottom: 20, left: 80})
		.width(640)
		.height(110)
		.transitionDuration(500)
		.elasticY(true)
		// .mouseZoomable(true)
		.dimension(violent_events_date)
		.group(violent_events_date_group)
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickFormat(function(v) {return date_format6(v);});


	var all_refugees = crossfilter(num_refugees_data);


	var all_refugees_date  = all_refugees.dimension(function(d) { return date_format3.parse(d["date"]); });
	var all_refugees_date_group = all_refugees_date.group().reduceSum(function(d) { return +d["number"]; });

	all_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 80})
		.width(640)
		.height(110)
		.transitionDuration(0)
		.renderArea(true)
		.brushOn(false)
		.dotRadius(5)
		.renderHorizontalGridLines(true)
		.title(function(d) { return date_format2(d.key) + ":" + d.value + " refugees"; })
		.dimension(all_refugees_date)
		.group(all_refugees_date_group);

	all_refugees_area_chart
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickFormat(function(v) {return date_format6(v);});
	all_refugees_area_chart
		.y(d3.scale.linear().domain([0, 4500000]))
		.yAxis().tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000]);



	var turkey_refugee = crossfilter(turkey_refugee_data);

	var turkey_refugee_date  = turkey_refugee.dimension(function(d) { return date_format2.parse(d["date"]); });
	var turkey_refugee_date_group = turkey_refugee_date.group().reduceSum(function(d) { return +d["number"]; });

	turkey_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 80})
		.width(220)
		.height(110)
		.transitionDuration(0)
		.renderArea(true)
		.brushOn(false)
		.dotRadius(5)
		.renderHorizontalGridLines(true)
		.title(function(d) { return date_format2(d.key) + ":" + d.value + " refugees"; })
		.dimension(turkey_refugee_date)
		.group(turkey_refugee_date_group);

	turkey_refugees_area_chart
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickValues([date_format1.parse("20140101"), date_format1.parse("20150101")]).tickFormat(function(v) {return date_format7(v);}).ticks(d3.time.years, 1);
	turkey_refugees_area_chart
		.y(d3.scale.linear().domain([0, 2500000]))
		.yAxis().tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000]);




	var jordan_refugee = crossfilter(jordan_refugee_data);

	var jordan_refugee_date  = jordan_refugee.dimension(function(d) { return date_format2.parse(d["date"]); });
	var jordan_refugee_date_group = jordan_refugee_date.group().reduceSum(function(d) { return +d["number"]; });

	jordan_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 0})
		.width(140)
		.height(110)
		.renderArea(true)
		.transitionDuration(10)
		// .renderArea(true)
		.brushOn(false)
		.dotRadius(5)
		.renderHorizontalGridLines(true)
		.title(function(d) { return date_format2(d.key) + ":" + d.value + " refugees"; })
		.dimension(jordan_refugee_date)
		.group(jordan_refugee_date_group);

	jordan_refugees_area_chart
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickValues([date_format1.parse("20140101"), date_format1.parse("20150101")]).tickFormat(function(v) {return date_format7(v);}).ticks(d3.time.years, 1);
	jordan_refugees_area_chart
		.y(d3.scale.linear().domain([0, 2500000]))
		.yAxis().tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000]);




	var iraq_refugee = crossfilter(iraq_refugee_data);

	var iraq_refugee_date  = iraq_refugee.dimension(function(d) { return date_format2.parse(d["date"]); });
	var iraq_refugee_date_group = iraq_refugee_date.group().reduceSum(function(d) { return +d["number"]; });

	iraq_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 0})
		.width(140)
		.height(110)
		.renderArea(true)
		.transitionDuration(10)
		// .renderArea(true)
		.brushOn(false)
		.dotRadius(5)
		.renderHorizontalGridLines(true)
		.title(function(d) { return date_format2(d.key) + ":" + d.value + " refugees"; })
		.dimension(iraq_refugee_date)
		.group(iraq_refugee_date_group);

	iraq_refugees_area_chart
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickValues([date_format1.parse("20140101"), date_format1.parse("20150101")]).tickFormat(function(v) {return date_format7(v);}).ticks(d3.time.years, 1);
	iraq_refugees_area_chart
		.y(d3.scale.linear().domain([0, 2500000]))
		.yAxis().tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000]);


	var egypt_refugee = crossfilter(egypt_refugee_data);

	var egypt_refugee_date  = egypt_refugee.dimension(function(d) { return date_format2.parse(d["date"]); });
	var egypt_refugee_date_group = egypt_refugee_date.group().reduceSum(function(d) { return +d["number"]; });

	egypt_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 0})
		.width(140)
		.height(110)
		.renderArea(true)
		.transitionDuration(10)
		// .renderArea(true)
		.brushOn(false)
		.dotRadius(5)
		.renderHorizontalGridLines(true)
		.title(function(d) { return date_format2(d.key) + ":" + d.value + " refugees"; })
		.dimension(egypt_refugee_date)
		.group(egypt_refugee_date_group);

	egypt_refugees_area_chart
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis().tickValues([date_format1.parse("20140101"), date_format1.parse("20150101")]).tickFormat(function(v) {return date_format7(v);}).ticks(d3.time.years, 1);
	egypt_refugees_area_chart
		.y(d3.scale.linear().domain([0, 2500000]))
		.yAxis().tickValues([0, 500000, 1000000, 1500000, 2000000, 2500000]);

		var violent_titles = crossfilter(violent_titles_data);

	var violent_titles_date  = violent_events.dimension(function(d) { return date_format1.parse(d["DATE"]); });



	dataTable.width(800).height(800)
	    .dimension(violent_titles_date)
	    .group(function(d){return ''})
	    .size(1000)
	    .columns([
	               function(d) { if (d.TITLE!='none'){return '<a href=\"' + d.SAMPLEURL + "\" target=\"_blank\"><span class=\"news-date\">"+date_format5(date_format1.parse(d.DATE))+"</span> "+d.TITLE+"</a>"}
									else {return 														'<a href=\"' + d.SAMPLEURL + "\" target=\"_blank\"><span class=\"news-date\">"+date_format5(date_format1.parse(d.DATE))+"</span>"+d.SAMPLEURL+" </a>" }
				   }
	    ])
	    .sortBy(function(d){ return d.DATE; })
	    // (optional) sort order, :default ascending
	    .order(d3.ascending);



	var ndx_i = 0, ndx_curr = ndx_i, ndx_j = violent_events_data.length - 1;

	dc.renderAll();

	d3.json("data/syria_poly_topo.json", function(error, map_data) {
		if (error) return console.error(error);

		var width = 470, height = 400;

		var svg = d3.select("#map-container").append("svg")
			.attr("id", "map")
			.attr("width", width)
			.attr("height", height);

		var heatmap = false;

		function event_explode(coordinates, magnitude) {
			svg.append("circle")
				.attr("cx", projection(coordinates)[0])
				.attr("cy", projection(coordinates)[1])
				.attr("r", 1)
				.style("fill-opacity", 1.0)
				.style("stroke-opacity", 1.0)
					.transition()
					.duration(2400)
					.ease(Math.sqrt)
					.attr("r", magnitude)
					.style("fill-opacity", 1e-6)
					.style("stroke-opacity", 1e-6)
					.remove();
		}

		function plot_heatmap(coordinates, magnitude, human_name, count) {
			svg.append("circle")
				.attr("cx", projection(coordinates)[0])
				.attr("cy", projection(coordinates)[1])
				.attr("r", magnitude/2)
					.append("title")
					.text(human_name+": "+count+" violent events");
		}

		var subunits = topojson.feature(map_data, map_data.objects.subunits);

		var projection = d3.geo.mercator()
			.center([36.3, 33.5])
			.scale(3600)
			.translate([70, 300]);

		var path = d3.geo.path()
			.projection(projection);

		svg.append("path")
			.datum(subunits)
			.attr("d", path);

		var n = violent_events_data.length, i = 0;

		var count_extent = d3.extent(violent_events_data, function(d) { return +d["COUNT"]; });

		var rad = d3.scale.linear().domain(count_extent).range([24, 80]);

		violent_events_bar_chart.renderlet(function(chart){
		// smooth the rendering through event throttling
			dc.events.trigger(function(){
				// focus some other chart to the range selected by user on this chart
				fltr = chart.filter();

				if (fltr != null) {
					// heatmap = true;

					ndx_i = first_index[date_format1(fltr[0])];
					ndx_j = last_index[date_format1(fltr[1])];

					if (ndx_j == undefined)
						ndx_j = violent_events_data.length - 1;

				} else {
					// svg.selectAll("circle").remove();

					ndx_i = 0;
					ndx_j = violent_events_data.length - 1;

					// heatmap = false;
				}

				max_count = 0;

				svg.selectAll("circle").remove();

				violent_events_count_by_location = {};
				for (var i = ndx_i; i <= ndx_j; i++) {
					if (violent_events_count_by_location[violent_events_data[i]["LAT"] + "_" + violent_events_data[i]["LONG"]] === undefined)
						violent_events_count_by_location[violent_events_data[i]["LAT"] + "_" + violent_events_data[i]["LONG"]] = {
							HUMANNAME: violent_events_data[i]["HUMANNAME"].replace("?", ""),
							LAT: parseFloat(violent_events_data[i]["LAT"]),
							LONG: parseFloat(violent_events_data[i]["LONG"]),
							COUNT: 0
						}

					violent_events_count_by_location[violent_events_data[i]["LAT"] + "_" + violent_events_data[i]["LONG"]]["COUNT"] += parseInt(violent_events_data[i]["COUNT"]);

					max_count = d3.max([max_count, violent_events_count_by_location[violent_events_data[i]["LAT"] + "_" + violent_events_data[i]["LONG"]]["COUNT"]]);
				}

				rad_heat = d3.scale.linear().domain([1, max_count]).range([24, 80]);

				for (var latlong in violent_events_count_by_location) {
					plot_heatmap(
						[violent_events_count_by_location[latlong].LONG, violent_events_count_by_location[latlong].LAT],
						rad_heat(violent_events_count_by_location[latlong].COUNT),
						violent_events_count_by_location[latlong].HUMANNAME,
						violent_events_count_by_location[latlong].COUNT
					);
				}

				dt_i = date_format1.parse(violent_events_data[ndx_i]["DATE"]);
				dt_j = date_format1.parse(violent_events_data[ndx_j]["DATE"]);

				$(".map-date").text("from "+date_format5(dt_i)+" to "+date_format5(dt_j));
				$("#more-news").attr("href", "https://www.google.com/search?q=syria&source=lnt&"
					+"tbs=cdr%3A1%2Ccd_min%3A"+(dt_i.getMonth() + 1)+"%2F"+(dt_i.getDate())+"%2F"+(dt_i.getFullYear())
					+"%2Ccd_max%3A"+(dt_j.getMonth() + 1)+"%2F"+(dt_j.getDate())+"%2F"+(dt_j.getFullYear())+"&tbm=nws");

				all_refugees_area_chart.focus(chart.filter());
				turkey_refugees_area_chart.focus(chart.filter());
				jordan_refugees_area_chart.focus(chart.filter());
				iraq_refugees_area_chart.focus(chart.filter());
				egypt_refugees_area_chart.focus(chart.filter());

				// console.log(123);
			});
		});

		// setInterval(function() {
		// 	// console.log(violent_events_data[i]["DATE"]);
		// 	if (!heatmap) {
		// 		var curr_date = parseInt(violent_events_data[ndx_curr]["DATE"]);

		// 		while (parseInt(violent_events_data[ndx_curr]["DATE"]) == curr_date) {
		// 			$("#map-date").text(date_format5(date_format1.parse(violent_events_data[ndx_curr]["DATE"])));

		// 			event_explode(
		// 				[parseFloat(violent_events_data[ndx_curr]["LONG"]), parseFloat(violent_events_data[ndx_curr]["LAT"])],
		// 				rad(parseInt(violent_events_data[ndx_curr]["COUNT"]))
		// 			);

		// 			ndx_curr = (ndx_curr == ndx_j) ? ndx_i : ndx_curr + 1;
		// 		}
		// 	}
		// }, 600);
	});
});
