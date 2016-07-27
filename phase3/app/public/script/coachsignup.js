
// Used to hide and show location fields depending on offline or online coach.
$(document).ready(function(){
	var $coachtype = $('#coachtype option:selected');
	var $location = $('#offlineLocation');

	$('#coachtype').on('change', function(){
		$coachtype = $('#coachtype option:selected');
		if ($coachtype.text() == 'Online'){
			$('#offlineLocation input').removeAttr('required')
			$location.hide();
		} else if ($coachtype.text() == 'Offline' || $coachtype.text() == 'Both'){
				$('#offlineLocation input').attr("required", true);
			$location.show();
		}
	});
});