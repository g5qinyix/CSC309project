
// Used to hide and show location fields depending on offline or online coach.
$(document).ready(function(){
	var $coachtype = $('#coachtype option:selected');
	var $location = $('#offlineLocation');
	if ($coachtype.text() == 'Online'){
		location.hide();
	}
	$('#coachtype').on('change', function(){
		$coachtype = $('#coachtype option:selected');
		if ($coachtype.text() == 'Online'){
			$location.hide();
		} else if ($coachtype.text() == 'Offline' || $coachtype.text() == 'Both'){
			$location.show();
		}
	});
});