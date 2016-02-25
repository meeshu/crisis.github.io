for (var date_ndx in data_by_dates) {
		dataset.push(data_by_dates[date_ndx]);
	}

	console.log(dataset);

	var violent_events_bar_chart   = dc.barChart("#dc-violent-events");
	var turkey_refugees_area_chart = dc.lineChart("#dc-refugees-turkey");


	// var violent_events = crossfilter(violent_events_data);

	// var violent_events_date  = violent_events.dimension(function(d) { return date_format1.parse(d["DATE"]); });
	// var violent_events_count = violent_events.dimension(function(d) { return +d["COUNT"]; });
	// var violent_events_date_group = violent_events_date.group();

	var facts = crossfilter(dataset);
	var all = facts.groupAll();

	var violent_events_date_value  = facts.dimension(function(d) { return date_format1.parse(d.date); });
	var violent_events_count_group = violent_events_date_value.group().reduceSum(function(d) { return d.num_violent_events; });
	var turkey_refugee_count_group = violent_events_date_value.group().reduceSum(function(d) { return (d.num_refugees_turkey ? d.num_refugees_turkey : 0); });

	violent_events_bar_chart.margins({top: 10, right: 10, bottom: 20, left: 40})
		.width(960)
		.height(200)
		.transitionDuration(500)
		.elasticY(true)
		.mouseZoomable(true)
		.dimension(violent_events_date_value)
		.group(violent_events_count_group)
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis();


	// var turkey_refugee_date  = turkey_refugee.dimension(function(d) { return date_format2.parse(d["date"]); });
	// var turkey_refugee_date_group = violent_events_date.group().reduce(
	// 	function(p, v) { p = parseInt(data_by_dates[v["DATE"]]["num_refugees_turkey"]); return p; },
	// 	function(p, v) { p = parseInt(data_by_dates[v["DATE"]]["num_refugees_turkey"]); return p; },
	// 	function() { return 0; }
	// );

	// console.log(turkey_refugee_date_group.all());

	turkey_refugees_area_chart.margins({top: 10, right: 10, bottom: 20, left: 40})
		.width(960)
		.height(120)
		.transitionDuration(500)
		.elasticY(true)
		.mouseZoomable(true)
		.renderArea(true)
		.dimension(violent_events_date_value)
		.group(turkey_refugee_count_group)
		.x(d3.time.scale().domain(d3.extent(violent_events_data, function(d) { return date_format1.parse(d["DATE"]); })))
		.xAxis();

	dc.renderAll();