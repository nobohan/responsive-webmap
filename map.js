// OpenLayers 3 - Test with mapserver for B-CGMS - Julien Minet - July 2016. 

// Definition of OpenLayers controls
var scaleLine = new ol.control.ScaleLine()

// Map creation
var map = new ol.Map({
   target: document.getElementById('map'),  // instead of "target: 'map' " because of the cursor pointer
   view: new ol.View({
   	center: ol.proj.transform([4.5, 50], 'EPSG:4326', 'EPSG:3857'),
      zoom: 8
   }),
   controls: ol.control.defaults({scaleLine: false}).extend([scaleLine]),
});

// Add layers

 /*var layername='met';
 var meteo_shp = new ol.layer.Tile({
   source: new ol.source.TileWMS({
           url: 'http://localhost/cgi-bin/mapserv?map=/var/www/CGMS/mapserver/ol3/meteo_tx_shp.map&request=GetMap&service=WMS&map.layer[0]=data+'+layername+'.shp',
           params: {LAYERS: 'meteo'} 
           })
 });
 map.addLayer(meteo_shp);*/
 
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




// Mobile layout
$('.ol-scale-line').addClass('hidden-xs')
$('.ol-attribution').addClass('hidden-xs')

// Hide/show panel
collapsePanel = function(){
   alert();  
  //$('div#panel')
}

