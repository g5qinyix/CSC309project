var map;
// sample address: 9 Isabella St
function initMap() {
	// Coordinates for Toronto
	var myLatLng = {lat: 43.6629, lng: -79.3957};

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 12,
	  center: myLatLng
	});
	displayMarkers();

 }
 // TODO: ACCOUNT FOR BOTH & OFFLINE IN ROUTES.JS
 function displayMarkers(){
	var coachInfo = JSON.parse(document.getElementById('coachInfo').innerHTML);
	console.log(coachInfo);
	for (var i=0; i<coachInfo.length; i++){
		var latitude = coachInfo[i]["lat"];
		var longitude = coachInfo[i]["lng"];
		console.log("latitude:"+latitude);
		console.log("longitude:"+longitude);

		console.log(coachInfo[i].nickname);
		var contentString = "<div>" +
			"<p>" + coachInfo[i].name + "</p><br>" +
			"<p>" + coachInfo[i].email + "</p><br>" +
			"</div>";
		var infoWindow = new google.maps.InfoWindow({
			content: contentString
		});

		var marker = new google.maps.Marker({
			position: {lat:  parseFloat(latitude), lng:  parseFloat(longitude)},
			map: map,
		});
		marker.addListener('click', function(){
			infoWindow.open(map, marker);
		});
	}
 }
