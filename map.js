// OpenLayers 3 - Test with mapserver for B-CGMS - Julien Minet - July 2016. 

// Definition of OpenLayers controls
var scaleLine = new ol.control.ScaleLine()

// Map creation
var map = new ol.Map({
   target: document.getElementById('map'),  // instead of "target: 'map' " because of the cursor pointer
   view: new ol.View({
   	center: ol.proj.transform([4.5, 50.5], 'EPSG:4326', 'EPSG:3857'),
      zoom: 8
   }),
   controls: ol.control.defaults({scaleLine: false}).extend([scaleLine]),
});

// Add layers

var setLayer = function(layername){
	layer = new ol.layer.Tile({
	source: new ol.source.TileWMS({
	    url: 'http://localhost/cgi-bin/mapserv?map=/var/www/CGMS/mapserver/ol3/meteo_tx_shp.map&request=GetMap&service=WMS&map.layer[0]=data+'+layername+'.shp',
	    params: {LAYERS: 'meteo'} 
	    })
	})
	map.addLayer(layer);
};

setLayer('met');


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






