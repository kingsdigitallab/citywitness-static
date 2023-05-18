$(document).ready(function(){
ll = new OpenLayers.LonLat(-438662.550653085,6731869.9908);

geodjango_point.map.setCenter(ll);

geodjango_point.map.zoomTo(16);

var raster = new OpenLayers.Layer.WMS("Raster",
                                   "/geoserver/gwc/service/wms/",
                                   {layers:"CityWitness:raster_tif_blend_4326",opacity:0.4,transparent:true,isBaseLayer:true});
							
var c12_13_defence_line = new OpenLayers.Layer.WMS("12_13c_def_line",
                                   "/geoserver/gwc/service/wms/",
                                   {layers:"CityWitness:12th_13th_century_defence_line_4326",opacity:0.5,transparent:'true',isBaseLayer:false});


var c12_13_possible= new OpenLayers.Layer.WMS("12_13c_poss",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:12th_13th_century_possible_4326",opacity:0.5,transparent:'true',isBaseLayer:false});			
									
var c13_14_possible= new OpenLayers.Layer.WMS("13_14c_poss",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:13th-14th_possible_4326",opacity:0.5,transparent:'true',isBaseLayer:false});				

var c13_defence = new OpenLayers.Layer.WMS("13c_def",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:13th_century_defence_line_4326",opacity:0.5,transparent:'true',isBaseLayer:false});

var c13_possible= new OpenLayers.Layer.WMS("13c_poss",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:13th_century_possible_4326",opacity:0.5,transparent:'true',isBaseLayer:false});	

var bailey_walls= new OpenLayers.Layer.WMS("bailey_walls",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Bailey_Walls_4326",opacity:0.5,transparent:'true',isBaseLayer:false});							

var castle_bailey= new OpenLayers.Layer.WMS("castle_bailey",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Castle_Bailey_4326",opacity:0.5,transparent:'true',isBaseLayer:false});										


var castle_ditch= new OpenLayers.Layer.WMS("castle_ditch",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Castle_Ditch_4326",opacity:0.5,transparent:'true',isBaseLayer:false});

var lc11_12_poss = new OpenLayers.Layer.WMS("late_11_12c_poss",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Late_11th_12th_possible_4326",opacity:0.5,transparent:'true',isBaseLayer:false});
									
var new_castle = new OpenLayers.Layer.WMS("new_castle",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:New_Castle_4326",opacity:0.5,transparent:'true',isBaseLayer:false});
									
									
var old_castle = new OpenLayers.Layer.WMS("old_castle",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Old_Castle_4326",opacity:0.5,transparent:'true',isBaseLayer:false});			

var old_castle_ditches = new OpenLayers.Layer.WMS("old_castle_ditches",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Old_Castle_Ditches_4326",opacity:0.5,transparent:'true',isBaseLayer:false});
									
var new_castle = new OpenLayers.Layer.WMS("old_castle_ditches",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:New_Castle_4326",opacity:0.5,transparent:'true',isBaseLayer:false});
									
									
var poss_def_boundary = new OpenLayers.Layer.WMS("poss_defence_boundary",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Possible_defence_boundary_4326",opacity:0.5,transparent:'true',isBaseLayer:false});


var st_john_boh = new OpenLayers.Layer.WMS("st_john_boh",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:St_John_BoH_4326",opacity:0.5,transparent:'true',isBaseLayer:false});

var st_john_church = new OpenLayers.Layer.WMS("st_john_church",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:St_John_Churchyard_4326",opacity:0.5,transparent:'true',isBaseLayer:false});									

var st_mary_boh = new OpenLayers.Layer.WMS("st_mary_boh",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:St_Mary_BoH_4326",opacity:0.5,transparent:'true',isBaseLayer:false});										

									
var st_mary_church = new OpenLayers.Layer.WMS("st_mary_church",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:St_Mary_Churchyard_4326",opacity:0.5,transparent:'true',isBaseLayer:false});	

var streets = new OpenLayers.Layer.WMS("streets",
									"/geoserver/gwc/service/wms/",									
									{layers:"CityWitness:Streets_BoH_4326",opacity:0.5,transparent:true,isBaseLayer:false});	

									
geodjango_point.map.addLayer(raster);
geodjango_point.map.addLayer(streets);
	
geodjango_point.map.addLayer(st_john_church);	
geodjango_point.map.addLayer(st_john_boh);
	
geodjango_point.map.addLayer(st_mary_church);
geodjango_point.map.addLayer(st_mary_boh);
geodjango_point.map.addLayer(new_castle);
geodjango_point.map.addLayer(c12_13_defence_line);									
geodjango_point.map.addLayer(c12_13_possible);							
geodjango_point.map.addLayer(c13_14_possible);
geodjango_point.map.addLayer(c13_defence);
geodjango_point.map.addLayer(c13_possible);
geodjango_point.map.addLayer(bailey_walls);
geodjango_point.map.addLayer(castle_bailey);
geodjango_point.map.addLayer(lc11_12_poss);
geodjango_point.map.addLayer(old_castle);
geodjango_point.map.addLayer(old_castle_ditches);															   
geodjango_point.map.addLayer(poss_def_boundary);	

$('#id_point_map').width('800px');

$('#id_point_map').height('600px');
});

											   
	
									
							



