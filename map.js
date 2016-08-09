// OpenLayers 3 - Test with mapserver for B-CGMS - Julien Minet - July 2016. 

// Forms functions

// Initialize the date pickers
$(".formDate").datepicker({
    	dateFormat: "yy-mm-dd",
    	defaultDate: "2013-06-08"
});  

// updateLayer button
var updateLayer = function(){
   var variable = $('#formVariable').val();
   var stat = $('#formStat').val();
   var spatial = $('#formSpatial').val();
   //var date = $('#formDate').val();
   var date = $('#formDate').datepicker('getDate');
   // if 'xs' do this:
   // var date = $('#formDateXs').datepicker('getDate');
   var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
   var mm = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);   
   var yyyy = date.getFullYear();
   console.log(variable, stat, spatial, yyyy, mm, dd);
   // update map
   // TODO: remove previous layers
   // TODO: check if the layer exist!
   //olmap.removeLayer()
   showLayer('geom from meteo'+yyyy+mm+dd+'_grid', 'postgis');
   
   // TODO: show legend   

}

// UpdateData button
var updateData = function(){
	var variable = $('#formVariable').val();
   var stat = $('#formStat').val();
   var spatial = $('#formSpatial').val();
   var date = $('#formDate').datepicker('getDate')
   var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
   var mm = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);   
   var yyyy = date.getFullYear();
	// select Data with SQL command
	// Update the modal content
}

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


// Add layers functions

var showLayer = function(layername, format){
	layer = new ol.layer.Tile({
	source: new ol.source.TileWMS({
	    url: 'http://localhost/cgi-bin/mapserv?map=/var/www/CGMS/proto/meteo_tx_'+format+'.map&map&data='+layername,
	    params: {LAYERS: 'meteo'} 
	    })
	})
	olmap.addLayer(layer);
};

var showLayerPostGISsimple = function(layername){
	layer = new ol.layer.Tile({
	source: new ol.source.TileWMS({
	    url: 'http://localhost/cgi-bin/mapserv?map=/var/www/CGMS/proto/meteo_tx_postgis_'+layername+'.map',
	    params: {LAYERS: 'meteo'} 
	    })
	})
	olmap.addLayer(layer);
};

//showLayer('met.shp', 'shp');
//showLayer('geom from meteo20130608_grid', 'postgis')

//setLayerPostGISsimple('07')
//setLayerPostGISsimple('08')

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
   

