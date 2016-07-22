var map;
// How do I determine latitude and longitute of coaches?
// Need to geocode
function initMap() {
	// Coordinates for Toronto
	var myLatLng = {lat: 43.6629, lng: -79.3957};

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: myLatLng
	});
	$('#priceSelect').on('change', function(){
		displayMarkers(this.value);
	});

 }
 
 function displayMarkers(pricingTier){
	 if (pricingTier === "free"){
		 
	 } else if (pricingTier === "tier1"){
		 
	 } else if (pricingTier === "tier2"){
		 
	 } else if (pricingTier === "tier3"){
		 
	 } else if (pricingTier === "tier4"){
		 
	 }
 }
	/*var marker = new google.maps.Marker({
	  position: {lat: 43.6629, lng: -79.3957},
	  map: map,
	  title: 'Hello World!'
	});*/