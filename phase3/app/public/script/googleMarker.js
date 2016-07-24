var map;
// sample address: 9 Isabella St
function initMap() {
	// Coordinates for Toronto
	var myLatLng = {lat: 43.6629, lng: -79.3957};

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: myLatLng
	});
	$('#priceSelect').on('change', function(){
		//console.log(this.value);
		displayMarkers(this.value);
	});

 }
 
 function displayMarkers(pricingTier){
 	 var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
 	 var urlAPIKey = "&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8"
	 if (pricingTier === "Free"){
		 
	 } else if (pricingTier === "$1-$10"){
	 	User.find({'local.occupation': 'coach'}).exec(function(err, coaches){
	 		console.log(coaches[0].local.location);
	 	});
		httpGet();
	 } else if (pricingTier === "$11-20"){
		 
	 } else if (pricingTier === "$21-30"){
		 
	 } else if (pricingTier === "$30+"){
		 
	 }
 }

 function httpGet(url){
 	var jsonHTTP = new XMLHttpRequest();
 	//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8
 	jsonHTTP.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8", false);
 	jsonHTTP.send(null);
 	console.log(jsonHTTP.responseText);
 }

 function parseAddress(addressString){

 }
	/*var marker = new google.maps.Marker({
	  position: {lat: 43.6629, lng: -79.3957},
	  map: map,
	  title: 'Hello World!'
	});*/
