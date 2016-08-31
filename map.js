// OpenLayers 3 - Test with mapserver for B-CGMS - Julien Minet - July 2016. 


// 1) Forms - data functions

// Initialize the date pickers
$(".formDate").datepicker({
    	dateFormat: "yy-mm-dd",
    	defaultDate: "2013-06-08"
});  

// Get user inputs from the #generalForm
var getUserInputs = function () {
   var variable = $('#formVariable').val();
   var stat = $('#formStat').val();
   var spatial = $('#formSpatial').val();
   var date = $('#formDate').datepicker('getDate');
   var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
   var mm = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);   
   var yyyy = date.getFullYear();
   //console.log(variable, stat, spatial, yyyy, mm, dd);
   // TO DO: messages when fields are empty
   return { 
       variable: variable,
       stat: stat,
       spatial: spatial,
       yyyy: yyyy, 
       mm: mm,
       dd: dd
   }
}


// getData function (if needed?)
// TODO: select data from database, with a SQL command, instead of loading csv with D3


// updateLayer button - show layer
var updateLayer = function(){
   var inputs = getUserInputs();
   
   // TODO: remove previous layers olmap.removeLayer()
   
   showLayer('geom from meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_grid', 'postgis');

   // TODO: show legend   

}

// showData button - show table
// could probably be done in jquery
var showData = function(){
   dataset=[];	
  
	// Remove previous elements, if any
   d3.select("#modal-table").selectAll('table').remove();   	  
  
   // Get user inputs
   var inputs = getUserInputs();
   
   // Get data using user inputs
	d3.csv('tables/meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_table.csv', function(csvdata) {
	   dataset = csvdata.map(function(d) { return [ +d["GRID_NO"], +d["TX"] ]; })  
      // Get table header
      dataheader = ['GRID', inputs.variable];	   // TO DO: load it from csv (or not)
	    
	   // Update the modal content
	   // Add modal title:
	   $('.modal-title').replaceWith(inputs.variable + ' data for ' + inputs.dd + "/" + inputs.mm + "/" + inputs.yyyy);
	    
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
	   table.selectAll("tr").data(dataset).enter().append("tr")
           .selectAll("td")
              .data(function(d) { return d; }).enter()
              .append("td")
              .text(function(d) { return d; });
 	    
	})
}

// show graph
var showGraph = function () {
	
	// Remove previous elements, if any
   d3.select("#modal-graph").selectAll("svg").remove();   	
	
   // Get user inputs
   var inputs = getUserInputs();
   
   // Get data using user inputs   
   d3.csv('tables/meteo'+inputs.yyyy+inputs.mm+inputs.dd+'_table.csv', function(csvdata) {
	   dataset = csvdata.map(function(d) { return [ +d["TX"] ]; })  
      
      // Add modal title:
	   $('.modal-title').replaceWith('Histogram of ' + inputs.variable + ' for ' + inputs.dd + "/" + inputs.mm + "/" + inputs.yyyy);
	          
      // Build graph with D3

		var formatCount = d3.format(",.0f");
		
		var margin = {top: 10, right: 30, bottom: 30, left: 30},
		    width = 600 - margin.left - margin.right,
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

		var hist = d3.select("#modal-graph").append("svg")
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
   })
}
	



// 2) Map - OpenLayers functions

// Definition of OpenLayers controls
var scaleLine = new ol.control.ScaleLine()

// Map creation
var olmap = new ol.Map({
   target: document.getElementById('map'),  // instead of "target: 'map' " because of the cursor pointer
   view: new ol.View({
   	center: ol.proj.transform([3.65, 50.5], 'EPSG:4326', 'EPSG:3857'),
      zoom: 8
   }),
   controls: ol.control.defaults({scaleLine: false}).extend([scaleLine]),
});

// Add default layers
var osmLayer = new ol.layer.Tile({
   source: new ol.source.OSM()
});
olmap.addLayer(osmLayer);

// Progress cursor when the source is loading
var showProgress = function (source) {
   source.on('tileloadstart', function() {
      $('.mapContainer').addClass('loading');
       });
   source.on('tileloadend', function() {
      $('.mapContainer').removeClass('loading');  
	   });
	source.on('tileloaderror', function() {
      $('.mapContainer').removeClass('loading');                   
	   });
};

// Set the source
var setSource = function (layername, format) {
   source = new ol.source.TileWMS({
	   url: 'http://localhost/cgi-bin/mapserv?map=/var/www/CGMS/proto/meteo_tx_'+format+'.map&map&data='+layername,
	   params: {LAYERS: 'meteo'}
	})
	return source;
};

// Show the layer
var showLayer = function(layername, format){
   layer = new ol.layer.Tile({
   	source: setSource(layername,format) 
	});
	showProgress(source);
	olmap.addLayer(layer);
	 
};


// 3) User experience / responsiveness functions
// Add specific classes to OpenLayers elements
$('.ol-scale-line').addClass('hidden-xs')
$('.ol-attribution').addClass('hidden-xs')


// Hide/show panel
var showPanel = true;
var collapsePanel = function(){
	if(showPanel === true){
	  $('div#panel').css('width','35px');
	  $('div#panelContent').css('opacity','0' );
	  $('div#collapseBtn button').text('>');
	  showPanel =! showPanel;
	  }
   else{
	  $('div#panel').css('width','300px');
	  $('div#panelContent').css('opacity','1');
	  $('div#collapseBtn button').text('<');
	  showPanel =! showPanel;
	  }
}

var showPanelXs = false;
var collapsePanelXs = function(){
	if(showPanelXs === true){
	  $('div#panel').css('width','0px');
	  $('div#panelContent').css('opacity','0' );
	  showPanelXs =! showPanelXs;
	  }
   else{
     $('div#panel').css('width','calc(100% - 45px)');
     $('div#panelContent').css('opacity','1');
     $('div#navbar').removeClass('in')
	  showPanelXs =! showPanelXs;
	  }
}
   

