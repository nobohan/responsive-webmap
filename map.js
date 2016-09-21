// CGMS - Julien Minet - Jean Pierre Huart - July-September 2016. 

var cgms = {

   ///////////////
	// VARIABLES //
	///////////////
	
	mapserv : "http://localhost/cgi-bin/mapserv?",
	showPanel : true,
	showPanelXs : false,
	
	/////////////
	// OBJECTS //
	/////////////
	
	// Map creation (using OpenLayers 3)
	olmap : new ol.Map({
	   target: document.getElementById('map'),  // instead of "target: 'map' " because of the cursor pointer
	   view: new ol.View({
	   	center: ol.proj.transform([3.65, 50.5], 'EPSG:4326', 'EPSG:3857'),
	      zoom: 8
	   })
	}),
		
	///////////////
	// FUNCTIONS //   - by alphabetic order
	///////////////
	
	// User experience / responsiveness functions (using jquery)
	// Hide/show panel
	collapsePanel : function(){
		if(this.showPanel === true){
		  $('div#panel').css('width','35px');
		  $('div#panelContent').css('opacity','0');
		  $('div#graph').css('padding-left','50px');
		  $('div#collapseBtn button').text('>');
		  this.showPanel =! this.showPanel;
		  }
	   else{
		  $('div#panel').css('width','300px');
		  $('div#panelContent').css('opacity','1');
		  $('div#graph').css('padding-left','310px');
		  $('div#collapseBtn button').text('<');
		  this.showPanel =! this.showPanel;
		  }
	},
	
	collapsePanelXs : function(){
		if(this.showPanelXs === true){
		  $('div#panel').css('width','0px');
		  $('div#panelContent').css('opacity','0' );
		  this.showPanelXs =! this.showPanelXs;
		  }
	   else{
	     $('div#panel').css('width','calc(100% - 45px)');
	     $('div#panelContent').css('opacity','1');
		  this.showPanelXs =! this.showPanelXs;
		  }
	},	
	
	// Get user inputs from the #generalForm (using jquery)
	getUserInputs : function () {
	   var variable = $('#formVariable').val();
	   var stat = $('#formStat').val();
	   var spatial = $('#formSpatial').val();
	   var date = $('#formDate').datepicker('getDate');
	   var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
	   var mm = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);   
	   var yyyy = date.getFullYear();
	   //console.log(variable, stat, spatial, yyyy, mm, dd);
	   // TO DO: messages when fields are empty
	   // TO DO: return units of the variable according to the variable. eg: if variable = temp, unit="°c". Store everything in json.
	   return { 
	       variable: variable,
	       stat: stat,
	       spatial: spatial,
	       yyyy: yyyy, 
	       mm: mm,
	       dd: dd
	   }
	},
	
	// Close the legend (using jquery)
	hideLegend : function(){
	   $('#legend').css('opacity','0')
	},	

	// init function: perform this at the opening of the page (using jquery & OpenLayers 3)
	init : function () {
		
      // hide the graph panel		
		this.showMapPanel()
		
      // Add a OSM layer as background (using OpenLayers 3)
		var osmLayer = new ol.layer.Tile({
	      source: new ol.source.OSM()
	   });
	   this.olmap.addLayer(osmLayer);
	   
	   // Add a scaleline  (using OpenLayers 3)
      this.olmap.addControl(new ol.control.ScaleLine());
      
	   // Add specific classes to OpenLayers elements  (using jquery & Bootstrap class)
      $('.ol-scale-line').addClass('hidden-xs');
      $('.ol-attribution').addClass('hidden-xs');      
      
      // Initialize the date pickers (using jquery)	
      $(".formDate").datepicker({
	    	dateFormat: "yy-mm-dd",
	    	defaultDate: "2013-06-08"
	   });
	},

	// Set the source of the layer (OpenLayers 3)
	setSource : function (layername, format) {
	   source = new ol.source.TileWMS({
		   url: this.mapserv + 'map=/var/www/CGMS/proto/meteo_tx_' + format + '.map&map&data=' + layername,
		   params: {LAYERS: 'meteo'}
		})
		return source;
	},
	
	// Show Data button - show table (using D3)
	// could probably be done in jquery
	showData : function(){
	   dataset=[];	
	  
		// Remove previous elements, if any
	   d3.select("#modal-table").selectAll('thead').remove();   	  
	  
	   // Get user inputs
	   var inputs = this.getUserInputs();
	   
	   // Get data using user inputs
		d3.csv('tables/meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_table.csv', function(csvdata) {
		   dataset = csvdata.map(function(d) { return [ +d["GRID_NO"], +d["TX"] ]; })  
	      
	      // Get table header
	      dataheader = ['GRID', inputs.variable];	   // TO DO: load it from csv (or not)
	     
	      // format of the data 
	      var formatDataset = [];	   
		   var dataFormat = d3.format(",.1f");
	      for (var i = 0, len = dataset.length; i < len; i++) {
	      	formatDataset.push([dataset[i][0],dataFormat(dataset[i][1])])
	      }	   
		   
		   // Update the modal content
		   // Add modal title:
		   $('#tableTitle').replaceWith(inputs.variable + ' data for ' + inputs.dd + "/" + inputs.mm + "/" + inputs.yyyy);
		    
		   // Select table 
		   var table = d3.select("#modal-table"),
		   thead = table.append("thead"),
		   tbody = table.append("tbody");
		
		   // append the header
		   thead.append("tr")
		        .selectAll("th")
		        .data(dataheader)
		        .enter()
		        .append("th")
		            .text(function(column) { return column; });
		   thead.exit().remove();
		            
		   // append the data
		   table.selectAll("tr").data(formatDataset).enter().append("tr")
	           .selectAll("td")
	              .data(function(d) { return d; }).enter()
	              .append("td")
	              .text(function(d) { return d; });
	 	    
		})
	},
	
   // Show graph panel (jquery)	
   showGraphPanel : function () {	
      $('#map').hide();
      $('#legend').hide();
		$('#graph').show();
   },
	
	// Show map panel (jquery)	
   showMapPanel : function () {	
      $('#graph').hide();
		$('#map').show();
		$('#legend').show();
   },
	
	// Show layer (OpenLayers 3)
	showLayer : function(layername, format){
	   layer = new ol.layer.Tile({
	   	source: this.setSource(layername,format) 
		});
		this.showProgress(source);
		this.olmap.addLayer(layer); 
	},		
	
	// Show legend (using jquery)
	showLegend : function(date){
		// Build the legend query for mapserver (imgsrc)
	   var mapfile = "map=/var/www/CGMS/proto/meteo_tx_postgis_legend.map&";
	   var request = "request=GetLegendGraphic&service=WMS&version=1.1.1&transparent=true&format=image%2Fpng&"
	   var layer = "layer=meteo&";
	   var datadate = "data=geom%20from%20meteo" + date + "_grid";
	   var imgsrc =  this.mapserv + mapfile + request + layer + datadate;
	   $("#legendImg").attr("src",imgsrc)
	   
	   // Show the legend
	   $('#legend').css('opacity','1')
	   //$('#legend').addClass('in',1000) // could be used in conjonction with Bootstrap class .collapse, but do not work well. Used opacity instead.
	},	
	
	// Progress cursor when the source is loading  (using jquery & OpenLayers 3)
	showProgress : function (source) {
	   source.on('tileloadstart', function() {
	      $('.mapContainer').addClass('loading');
	       });
	   source.on('tileloadend', function() {
	      $('.mapContainer').removeClass('loading');  
		   });
		source.on('tileloaderror', function() {
	      $('.mapContainer').removeClass('loading');                   
		   });
	},
	
   // Update map and graph according to form entries
   update : function () {
   	// Get user inputs
	   var inputs = this.getUserInputs();
	   
	   // Update the layer (map)
      this.updateLayer(inputs);
      
      // Update the graph
      this.updateGraph(inputs);
   },	
	
   // Show graph (using D3)
	updateGraph : function (inputs) {
     		
		// Remove previous elements, if any
	   d3.select("#graph-div").selectAll("svg").remove();   	
		
	   // Get data using user inputs   
	   d3.csv('tables/meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_table.csv', function(csvdata) {
		   dataset = csvdata.map(function(d) { return [ +d["TX"] ]; })  
	      
	      // Add modal title:
		   $('#graphTitle').replaceWith('Histogram of ' + inputs.variable + ' for ' + inputs.dd + "/" + inputs.mm + "/" + inputs.yyyy);
		          
	      // Build graph with D3
	
			//var formatCount = d3.format(",.0f");
			
	      if ($('div#graph').width() > 800 ) {	
	      	graphWidth = 600;
	      	}
	      else {
	      	graphWidth = $('div#graph').width()*0.9;
	      	}
			
			var margin = {top: 10, right: 30, bottom: 30, left: 30},
			    width = graphWidth - margin.left - margin.right,
			    height = 400 - margin.top - margin.bottom;
			
			var x = d3.scaleLinear()
			    .domain([10, 35])        // set the x range here
			    .rangeRound([0, width]);
			
			var bins = d3.histogram()
			    .domain(x.domain())
			    .thresholds(x.ticks(40))   // set the number of bins here
			    (dataset);
			
			var y = d3.scaleLinear()
			    .domain([0, d3.max(bins, function(d) { return d.length; })])
			    .range([height, 0]);	    
	
			var hist = d3.select("#graph-div").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			var bar = hist.selectAll(".bar")
			    .data(bins)
			  .enter().append("g")
			    .attr("class", "bar")
			    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
			
			bar.append("rect")
			    .attr("x", 1)
			    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
			    .attr("height", function(d) { return height - y(d.length); });
			
			hist.append("g")
			    .attr("class", "axis axis--x")
			    .attr("transform", "translate(0," + height + ")")
			    .call(d3.axisBottom(x));  
			    
			hist.append("text")      // text label for the x axis
	        .attr("x", width / 2 )
	        .attr("y", height + margin.bottom )
	        .style("text-anchor", "middle")
	        .text(inputs.variable);
	   })
	},
	
	
	// updateLayer button - show layer & legend
	updateLayer : function(inputs){
	   
	   // TODO: remove previous layers olmap.removeLayer()
	   // TODO: message when layer does not exist
	   this.showLayer('geom from meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_grid', 'postgis');
	
	   // show legend   
	   this.showLegend([inputs.yyyy+inputs.mm+inputs.dd])
	}
	
	// TODO: more functions:
	// getData function (if needed?)
	// TODO: select data from database, with a SQL command, instead of loading csv with D3
	

} // end of cgms object. 


// Initialize the page
cgms.init();

