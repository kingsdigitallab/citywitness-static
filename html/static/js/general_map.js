var mapBounds = new L.latLngBounds([51.61721715591853, -3.95033597946167],[51.625210450853054, -3.9342856407165527]);
var maxBounds = new L.latLngBounds([51.0, -4],[51.7, -3.90]);

$(document).ready(function(){

	if(navigator.appVersion.indexOf('MSIE 8')!=-1 || navigator.appVersion.indexOf('MSIE 7')!=-1) {
		oldIE = true;
	};



    $('#map').height(600);
  	Map = new L.map('map',{minZoom:14,scrollWheelZoom:false});
	Map.setMaxBounds(maxBounds);
    Map.fitBounds(mapBounds);
    var hash = new L.hash(Map)	
	//var terrain_layer = new L.TileLayer('/geotiles/tms/CW2/{z}/{x}/{y}.png',{maxZoom:20,attribution:'<a href="https://www.geomatics-group.co.uk">Geomatics Group</a>'});
	//var modern_streets = new L.TileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',{maxZoom:20,subdomains:['otile1','otile2','otile3','otile4'],attribution:'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'}).addTo(Map);	

	var modern_streets = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:20,subdomains:['a','b','c'],
		attribution : 'Tiles courtesy of OpenStreetMap'}).addTo(Map);

	BoH = new L.TileLayer.WMS('/geoserver/gwc/service/wms?',{layers:'CityWitness:BoH_mosaic',format:'image/png',maxZoom:20});
	//sketch = new L.TileLayer.WMS('/geoserver/gwc/service/wms?',{layers:'CityWitness:cw_sketch_1976',format:'image/png',maxZoom:20});	
	//medieval_town = new L.TileLayer('/geotiles/tms/CityWitness/{z}/{x}/{y}.png',{maxZoom:20});
	medieval_town_2 = new L.TileLayer('/geotiles/tms/CW2/{z}/{x}/{y}.png',{maxZoom:20,attribution:'<a href="https://www.geomatics-group.co.uk">Geomatics Group</a>'}).addTo(Map);

	// Add the GeoJSON interaction layer
    geoJsonInteraction = new L.geoJson(geoJsonMerge,
		{style:hiddenGeoJsonStyle,
			onEachFeature: function(feature,layer){
				layer.on('mouseover',function(){
				layer.setStyle(geoJsonHighlight);
			});
				layer.on('mouseout',function(){
				layer.setStyle(hiddenGeoJsonStyle);
			});
			
			popupVals = new Array();
			popupKeys = new Array();
			
			for (p in feature.properties){
				popupVals.push(feature.properties[p])
				popupKeys.push(p)
			}; 
			
            
			var popupHtml = '';
			
			for (key in popupKeys) {
				if (popupKeys[key] != 'Id'){
					popupHtml += "<p><strong>"+ popupKeys[key] +": </strong>" + popupVals[key] + "</p>"
				};
			};
		
				layer.bindPopup(popupHtml);
			}
			
	});

    labels = new L.TileLayer('/geotiles/tms/CW2_label/{z}/{x}/{y}.png',{maxZoom:20,minZoom:16}).addTo(Map);
    overlays = {'Medieval Town (simple)':medieval_town_2,'Medieval Town (interaction)':geoJsonInteraction,'Board of Health 1852':BoH,'Label medieval features':labels};
   	
	switcher = new L.control.layers(/*base_layers*/null,overlays,{collapsed:false}).addTo(Map);
	witnessSwitcher = new L.control.layers(null,null,{collapsed:false}).addTo(Map);
	
	// Move layer control out of map...
	$('#map-controls').append( $('.leaflet-control-layers') );
	
	$('.leaflet-control-layers:nth-of-type(1)').after('<div id="layer-control-divider" class="col-lg-3" style="min-height:10px;"></div>');
	
	witnessLayers();
	
	layerSwitcherCustomize();
	
});
	
	
function layerSwitcherCustomize() {
		$($('label:contains(" Medieval Town (simple)") input')[0]).change(function(){
			if($(this).is(':checked')){
				$("#slider-label").css("display","block");
				$("#slider").css("display","block");
				$(".mapSlider.medSlider").css("display","block");				
			}
			else {
				$("#slider-label").css("display","none");				
				$("#slider").css("display","none");
				$(".mapSlider.medSlider").css("display","none");					
			}
		});

		$('label:contains(" Medieval Town (simple)")').after('<label id="slider-label">Change opacity</label>')
		$('#slider-label').after('<div id="slider"></div>');

		sliderControls = 	'<div class="row mapSlider medSlider">';
		sliderControls +=	'<div class="span1 units">';
		sliderControls += 	'<span class="sliderControl icon-minus""> </span>';
		sliderControls +=	"</div>";
		sliderControls +=	'<div class="span 10 units">';
		sliderControls +=	'<div id="slider" style="display:block;"></div>';
		sliderControls +=	'</div>';
		sliderControls +=	'<div class="span1 units">';
		sliderControls +=	'<span class="sliderControl icon-plus"> </span>';
		sliderControls +=	'</div></div>';
	
		$('#slider-label').after($(sliderControls));		
		$("#slider").slider({
			min:0.2,
			max:1,
			step:0.05,
			value:1,
			change: function( event, ui ) {
				medieval_town_2.setOpacity(ui.value);
			}
		});

		L.DomEvent.disableClickPropagation($(".leaflet-control-layers-expanded")[0]);
	// Set initial hidden state of slider...	
	$("#slider-label").css("display","block");				
	$("#slider").css("display","block");
	$(".mapSlider.medSlider").css("display","block");

	// Same for Board of Health
	
	$($('label:contains(" Board of Health 1852") input')[0]).change(function(){
			if($(this).is(':checked')){
				$("#slider-label-1").css("display","block");
				$("#slider-1").css("display","block");
				$(".mapSlider.bohSlider").css("display","block");				
			}
			else {
				$("#slider-label-1").css("display","none");				
				$("#slider-1").css("display","none");
				$(".mapSlider.bohSlider").css("display","none");					
			}
		});

		$('label:contains(" Board of Health 1852")').after('<label id="slider-label-1">Change opacity</label>')
		$('#slider-label-1').after('<div id="slider-1"></div>');

		sliderControls1 = 	'<div class="row mapSlider bohSlider">';
		sliderControls1 +=	'<div class="span1 units">';
		sliderControls1 += 	'<span class="sliderControl icon-minus""> </span>';
		sliderControls1 +=	"</div>";
		sliderControls1 +=	'<div class="span 10 units">';
		sliderControls1 +=	'<div id="slider-1" style="display:block;"></div>';
		sliderControls1 +=	'</div>';
		sliderControls1 +=	'<div class="span1 units">';
		sliderControls1 +=	'<span class="sliderControl icon-plus"> </span>';
		sliderControls1 +=	'</div></div>';
	
		$('#slider-label-1').after($(sliderControls1));		
		$("#slider-1").slider({
			min:0.2,
			max:1,
			step:0.05,
			value:1,
			change: function( event, ui ) {
				BoH.setOpacity(ui.value);
			}
		});

		L.DomEvent.disableClickPropagation($(".leaflet-control-layers-expanded")[0]);
	// Set initial hidden state of slider...	
	$("#slider-label-1").css("display","none");				
	$("#slider-1").css("display","none");
	$(".mapSlider.bohSlider").css("display","none");
	
	
	$($('.leaflet-control-layers')[1]).before('<h3>Witnesses</h3>')

};

 
function witnessLayers(){
     // Witness route layers
	 witnessCragh = new L.geoJson(craghRoute,
		{
			onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}					
				};
				layer.bindPopup(popupHtml,{className:"bring-to-front"});
				if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteCragh);
					/*
					layer.on('mouseover', function () {
						this.setText(feature.properties["Narrative"], {repeat: true, attributes: {fill: 'black'}});
					});
					layer.on('mouseout', function () {
							this.setText(null);
					});					
					*/
				};				
			},
			pointToLayer: function (feature, latlng) {
			    if ( feature.properties["Number"] == 1 ) {
					return L.circleMarker(latlng, witnessMarkerCragh).bindLabel((feature.properties["Number"]).toString(),{direction:'right',noHide:true});
				}
				else {	
					return L.circleMarker(latlng, witnessMarkerCragh).bindLabel((feature.properties["Number"]).toString(),{direction:'left',noHide:true});
				}
			}				
	});

	witnessSwitcher.addOverlay(witnessCragh,'William Cragh');
	
	witnessMarshall= new L.geoJson(marshallRoute,
		{
			onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
                                        if (feature.properties["image"]){
                                                popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
                                        }
				};
				layer.bindPopup(popupHtml,{className:"bring-to-front"});
					if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteMarshall)
				};	
			},
			pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng,witnessMarkerMarshall).bindLabel((feature.properties["Number"]).toString(),{direction:'auto',noHide:true});
			}					
	});
	
	witnessSwitcher.addOverlay(witnessMarshall,'Thomas Marshall');
	
	witnessLoughour = new L.geoJson(loughourRoute,
		{
			onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml,{className:"bring-to-front"});
					if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteLoughour)
				};	
			},
			pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng,witnessMarkerLoughour).bindLabel((feature.properties["Number"]).toString(),{direction:'auto',noHide:true});
			}			
	});
	
	witnessSwitcher.addOverlay(witnessLoughour,'Adam Loughor');

	witnessHowell = new L.geoJson(howellRoute,
		{
			onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml,{className:"bring-to-front"});
					if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteHowell)
				};	
			},
			pointToLayer: function (feature, latlng) {
			    if ( feature.properties["Number"] == 2 ) {
					return L.circleMarker(latlng, witnessMarkerHowell).bindLabel((feature.properties["Number"]).toString(),{direction:'left',noHide:true});
				}
				else {	
					return L.circleMarker(latlng, witnessMarkerHowell).bindLabel((feature.properties["Number"]).toString(),{direction:'right',noHide:true});
				}
			}				
	});
	
	witnessSwitcher.addOverlay(witnessHowell,'John ap Hywel');	
	
	witnessBaggenham = new L.geoJson(baggenhamRoute,
		{
			onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml,{className:"bring-to-front"});
					if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteBaggenham)
				};	
			},
			pointToLayer: function (feature, latlng) {
			    if ( ([4,8,9,11,12]).indexOf(feature.properties["Number"]) != -1 ) {
					return L.circleMarker(latlng, witnessMarkerBaggenham).bindLabel((feature.properties["Number"]).toString(),{direction:'right',noHide:true});
				}
				else {	
					return L.circleMarker(latlng, witnessMarkerBaggenham).bindLabel((feature.properties["Number"]).toString(),{direction:'left',noHide:true});
				}
			}				
	});
	
	witnessSwitcher.addOverlay(witnessBaggenham,'John Baggeham');	
	
	witnessBriouze = new L.geoJson(briouzeRoute,
		{	onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
			},
			pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng,witnessMarkerBriouze).bindLabel((feature.properties["Number"]).toString(),{direction:'auto',noHide:true});
			}				
	});
	
	witnessSwitcher.addOverlay(witnessBriouze,'Mary de Briouze');	
	
	witnessSkinner = new L.geoJson(skinnerRoute,
		{	onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
			},

			pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng,witnessMarkerSkinner).bindLabel((feature.properties["Number"]).toString(),{direction:'auto',noHide:true});
			}				
			
	});	
	
	witnessSwitcher.addOverlay(witnessSkinner,'Henry Skinner');	

	witnessChaplain = new L.geoJson(chaplainRoute,
		{	onEachFeature: function(feature,layer){
			
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
			},
			pointToLayer: function (feature, latlng) {
					return L.circleMarker(latlng,witnessMarkerChaplain).bindLabel((feature.properties["Number"]).toString(),{direction:'auto',noHide:true});
			}					
	});	
	
	witnessSwitcher.addOverlay(witnessChaplain,'William of Codineston');	

	witnessWdBriouze = new L.geoJson(WdBriouzeRoute,
	    {
		onEachFeature: function(feature,layer){
			var popupHtml = "<h4>Journey point "+feature.properties["Number"] +"</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
				if (feature.geometry.type=='LineString'){
					layer.setStyle(witnessRouteWdBriouze)
				};
			},
			pointToLayer: function (feature, latlng) {
			    if ( feature.properties["Number"] == 3 || feature.properties["Number"] == 2 ) {
					return L.circleMarker(latlng, witnessMarkerWdBriouze).bindLabel((feature.properties["Number"]).toString(),{direction:'right',noHide:true});
				}
				else {	
					return L.circleMarker(latlng, witnessMarkerWdBriouze).bindLabel((feature.properties["Number"]).toString(),{direction:'left',noHide:true});
				}
			}		
	});	
	
	witnessSwitcher.addOverlay(witnessWdBriouze,"William de Briouze Jnr");	

	witnessMatthews = new L.geoJson(matthewsHouse,
	    {style:witnessMarkerMatthews,
		onEachFeature: function(feature,layer){
			var popupHtml = "<h4>Thomas Matthews' House </h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
				layer.bindLabel("Thomas Mathews' House",{noHide:true})		
			}
	});	
	
	witnessSwitcher.addOverlay(witnessMatthews,"Thomas Mathews' House");

	gallowsLayer = new L.geoJson(gallows,
	    {style:gallowsStyle,
		onEachFeature: function(feature,layer){
			var popupHtml = "<h4>The Gallows</h4>"
				if (feature.properties["Narrative"]){
					popupHtml += "<p>"+feature.properties["Narrative"]+"</p>"
					if (feature.properties["image"]){
						popupHtml += '<img style="width:250px;" src="'+feature.properties["image"]+'"></img>'
					}
				};
				layer.bindPopup(popupHtml);
				//layer.bindLabel( (feature.properties["order"]).toString()  ,{noHide:true})				
				layer.bindLabel( 'The Gallows',{noHide:true})								
			}
	}).addTo(Map);	
	
	//witnessSwitcher.addOverlay(gallowsLayer,"The Gallows");
	


	customiseWitnessSwitcher();
};


function customiseWitnessSwitcher(){
	$('label:contains(" William Cragh") input').
		before('<img class="witness-legend" src="/static/witness_images/green.png"></img>');
	$('label:contains(" Thomas Marshall") input').
		before('<img class="witness-legend" src="/static/witness_images/orange.png"></img>');
	$('label:contains(" Adam Loughor") input').
		before('<img class="witness-legend" src="/static/witness_images/blue.png"></img>');
	$('label:contains(" John ap Hywel") input').
		before('<img class="witness-legend" src="/static/witness_images/purple.png"></img>');
	$('label:contains(" John Baggeham") input').
		before('<img class="witness-legend" src="/static/witness_images/red.png"></img>');
	$('label:contains(" Mary de Briouze") input').
		before('<img class="witness-legend" src="/static/witness_images/pink.png"></img>');
	$('label:contains(" Henry Skinner") input').
		before('<img class="witness-legend" src="/static/witness_images/gray.png"></img>');
	$('label:contains(" William of Codineston") input').
		before('<img class="witness-legend" src="/static/witness_images/yellow.png"></img>');
	$("label:contains(' Thomas Mathews' House') input").
		before('<img class="witness-legend" src="/static/witness_images/brown.png"></img>');
	$("label:contains(' William de Briouze Jnr') input").
		before('<img class="witness-legend" src="/static/witness_images/light-blue.png"></img>');
	$("label:contains(' The Gallows') input").
		before('<img class="witness-legend" src="/static/witness_images/dark-gray.png"></img>');
};



// Styles
var basicGeoJsonStyle = {
    color: '#d3d3d3',
	weight:1,
	opacity:1,
    fill: '#d3d3d3',
	fillOpacity:0.8
};


var hiddenGeoJsonStyle = {
    opacity: 0,
	fillOpacity:0
};

var geoJsonHighlight = {
    color: 'red',
	weight:2,
	opacity:0.7
};

var witnessRouteCragh = {
    color: 'green',
	weight:2,
	opacity:0.8
    
};

var witnessMarkerCragh =  {
    radius: 8,
    fillColor: "green",
    color: "black",
    fill: true,   
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};

var witnessRouteMarshall = {
    color: 'orange',
	weight:2.5,
	opacity:1
};

var witnessMarkerMarshall =  {
    radius: 8,
    fillColor: "orange",
    color: "black",
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};

var witnessRouteLoughour = {
    color: 'blue',
	weight:2,
	opacity:0.8
};

var witnessMarkerLoughour =  {
    radius: 8,
    fillColor: "blue",
    color: "black",
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};

var witnessRouteHowell = {
    color: 'purple',
	weight:2,
	opacity:0.8
};

var witnessMarkerHowell =  {
    radius: 8,
    fillColor: "purple",
    color: "black",
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};


var witnessRouteBaggenham = {
    color: 'red',
	weight:2,
	opacity:0.8
};

var witnessMarkerBaggenham =  {
    radius: 8,
    fillColor: "red",
    color: "black",
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};

var witnessMarkerBriouze =  {
    radius: 8,
    fillColor: "pink",
    color: "gray",
    fill:true,
    weight: 1, 
    opacity: 1,
    fillOpacity: 1
};

var witnessMarkerSkinner =  {
    radius: 8,
    fillColor: "gray",
    color: "black",
	fill:true,
    weight: 1, 
    opacity: 1,
    fillOpacity: 1
};

var witnessMarkerChaplain =  {
    radius: 8,
    fillColor: "yellow",
    color: "black",
    fill: true,
    weight: 1, 
    opacity: 1,
    fillOpacity: 1
};


var witnessMarkerMatthews =  {
    fillColor: "#996600",
    color: "#990033",
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
};


var witnessRouteWdBriouze = {
    color: 'rgb(0,255,255)',
	weight:2,
	opacity:1
};

var gallowsStyle = {
    fillColor: "rgb(47,79,79)",
    color: 'black',
    fill:true,
	weight:2,
	opacity:1,
    fillOpacity: 0.9
};


var witnessMarkerWdBriouze = {
    radius: 8,
    fillColor: 'rgb(0,255,255)',
    color: "black",
	fill:true,
    weight: 1, 
    opacity: 1,
    fillOpacity: 0.8
}
