var map;
// sample address: 9 Isabella St
function initMap() {
	// Coordinates for Toronto
	var myLatLng = {lat: 43.6629, lng: -79.3957};

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: myLatLng
	});
	/*$('#priceSelect').on('change', function(){
		//console.log(this.value);
		displayMarkers();
	});*/
	displayMarkers();

 }
 
 function displayMarkers(){
	var coachInfo = JSON.parse(document.getElementById('coachInfo').innerHTML);
 	var url = "https://maps.googleapis.com/maps/api/geocode/json?address="
	var urlAPIKey = "&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8"
	console.log(coachInfo);
	for (var i=0; i<coachInfo.length; i++){
		var result = JSON.parse(httpGet(url+parseAddress(coachInfo[i].address)+urlAPIKey));
		var latitude = result.results[0]["geometry"]["location"]["lat"];
		var longitude = result.results[0]["geometry"]["location"]["lng"];
		var marker = new google.maps.Marker({
			position: {lat: latitude, lng: longitude},
			map: map,
			title: coachInfo[i].email
		});
	}
 }

 function httpGet(url){
	 var urlAPIKey = "&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8"
 	var jsonHTTP = new XMLHttpRequest();
 	//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8
 	jsonHTTP.open("GET", url, false);
 	jsonHTTP.send(null);
 	//console.log(jsonHTTP.responseText);
	return(jsonHTTP.responseText);
 }

 function parseAddress(addressString){
	if (undefined !== addressString && addressString.length){
		var addressParts = addressString.split(" ");
		var result = addressParts[0];
		for (var i=1; i<addressParts.length; i++){
			result+="+" + addressParts;
		}
	return result;
	}
	
 }
	/*var marker = new google.maps.Marker({
	  position: {lat: 43.6629, lng: -79.3957},
	  map: map,
	  title: 'Hello World!'
	});*/
