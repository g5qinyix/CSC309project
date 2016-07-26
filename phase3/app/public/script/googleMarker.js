var map;
// sample address: 9 Isabella St
function initMap() {
	// Coordinates for Toronto
	var myLatLng = {lat: 43.6629, lng: -79.3957};

	map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 13,
	  center: myLatLng
	});
	displayMarkers();

 }

 function displayMarkers(){
	var coachInfo = JSON.parse(document.getElementById('coachInfo').innerHTML);
	console.log(coachInfo);
	var marker;
	var infoWindow;
	var contentString;
	for (var i=0; i<coachInfo.length; i++){
		var latitude = coachInfo[i]["lat"];
		var longitude = coachInfo[i]["lng"];
		console.log("latitude:"+latitude);
		console.log("longitude:"+longitude);

		console.log(coachInfo[i].nickname);
		contentString = "<div>" +
			"<p>Name: " + coachInfo[i].name + "</p>" +
			"<p>Email: " + coachInfo[i].email + "</p>" +
			"<p>Cost: $" + coachInfo[i].cost + "</p>" +
			"<a href='/users/" + coachInfo[i].profile + "'>Profile</a>" +
			"</div>";
		infoWindow = new google.maps.InfoWindow({
			content: contentString
		});

		marker = new google.maps.Marker({
			position: {lat:  parseFloat(latitude), lng:  parseFloat(longitude)},
			map: map,
		});
		google.maps.event.addListener(marker, 'click', (function(marker, contentString, infoWindow){
			return function(){
				infoWindow.setContent(contentString);
				infoWindow.open(map, marker);
				google.maps.event.addListener(map, 'click', function(){
					infoWindow.close();
				});
			}
		})(marker, contentString, infoWindow));
	}
 }
