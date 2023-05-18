var mapBounds = new L.latLngBounds([51.61739035889871, -3.95082950592041],[51.62538362332603, -3.9320540428161626]);
var maxBounds = new L.latLngBounds([51.0, -4],[51.7, -3.90]);

var medswanIcon = L.icon({
    iconUrl: '/static/js/images/marker-icon-med.png',
    iconRetinaUrl: '/static/js/images/marker-icon-med-2x.png',
    iconSize: [25, 41],
    shadowSize: [41, 41],	
    shadowUrl: '/static/js/images/marker-shadow.png',
	shadowAnchor: [13, 21]	
});



function getTourLocationDetail(id){
    $.ajax(
	{
         url:'/tour-location/'+id,
         dataType:'html',
		 success:function(data){
			$('#tour-content').html(data);
		 }
	}
    )
};

$(document).ready(function(){
	$('#map').height(600);
  	Map = new L.map('map',{minZoom:14,scrollWheelZoom:false});
	Map.setMaxBounds(maxBounds);
        Map.fitBounds(mapBounds);
	
	//modern_streets = new L.TileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png',{maxZoom:20,subdomains:['otile1','otile2','otile3','otile4'],attribution:'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'});


        modern_streets = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:20,subdomains:['a','b','c'],
                attribution : 'Tiles courtesy of OpenStreetMap'}).addTo(Map);

	
	medieval_town_2 = new L.TileLayer('/geotiles/tms/CW2/{z}/{x}/{y}.png',{maxZoom:20,attribution:'<a href="https://www.geomatics-group.co.uk">Geomatics Group</a>',opacity:0.5}).addTo(Map);
	
	
    overlays = {'Medieval Town':medieval_town_2}	
	switcher = new L.control.layers(/*base_layers*/null,overlays,{collapsed:false}).addTo(Map);



	var tourLayer = new L.geoJson(tourObject,
			{onEachFeature: function(feature,layer){	
			var popupHtml = '<div class="pav-marker"><span class="pav-marker-no">'+
			+ feature.properties["pavement-marker"]
			+'</span></div>' +
			"<div><h4>"+feature.properties["medname"] +"</h4>" +
				"<p>"+feature.properties["popup-content-about"]+"</p>" +
				'<a href="#" data-reveal-id="tour-modal"  data-reveal-ajax="/' + feature.properties['language_code']+ '/tours/tour-detail/' + 
							feature.properties['tour_id'] + '/' +
							feature.properties['order'] + '/' +
							feature.properties['location_id'] + 						
							'">Learn more...</a></div>'
							
				layer.bindPopup(popupHtml);
			        },
                        pointToLayer: function (feature, latlng) {
                               var marker = new L.Marker(latlng, {icon:medswanIcon});
							   marker.bindLabel( (feature.properties["order"]).toString()  ,{noHide:true})
                               marker.tour_id =  feature.properties["tour_id"];

                               return marker;
                        }
			
			}
	).addTo(Map);
       
	Map.fitBounds(tourLayer.getBounds());

    Map.addLayer(modern_streets);
	
	layerSwitcherCustomize();

	

});

function layerSwitcherCustomize() {
		$($('label:contains(" Medieval Town") input')[0]).change(function(){
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

		$('label:contains(" Medieval Town")').after('<label id="slider-label">Change opacity</label>')
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
			value:0.5,
			change: function( event, ui ) {
				medieval_town_2.setOpacity(ui.value);
			}
		});

		L.DomEvent.disableClickPropagation($(".leaflet-control-layers-expanded")[0]);
	// Set initial hidden state of slider...	
	$("#slider-label").css("display","block");				
	$("#slider").css("display","block");
	$(".mapSlider.medSlider").css("display","block");	
}



