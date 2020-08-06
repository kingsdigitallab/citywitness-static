$(document).ready(function(){


swanseaBounds = new OpenLayers.Bounds(left=-440085,bottom=6730843.5,right=-437218,top=6732754)
geodjango_geom.map.zoomToExtent(swanseaBounds)
//geodjango_point_geom.map.zoomToExtent(swanseaBounds)



var raster = new OpenLayers.Layer.WMS("Raster",
                                   "/geoserver/gwc/service/wms/",
                                   {layers:"Project_data:dcow_backdrop",opacity:0.6,transparent:true,isBaseLayer:true});
							


var partial = new OpenLayers.Layer.WMS("partial",
				"/geoserver/gwc/service/wms/",									
				{layers:"TMS_Style_CW",opacity:0.5,transparent:true,isBaseLayer:false});
									
geodjango_geom.map.addLayer(raster);
geodjango_geom.map.addLayer(partial);	

//geodjango_point_geom.map.addLayer(raster);
//geodjango_point_geom.map.addLayer(partial);

$('#id_point_map').width('800px');

$('#id_point_map').height('600px');
});
