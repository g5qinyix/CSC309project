$(document).ready(function(){
	console.log("!!!!!!!");
  
    $('#sendmessage').on('click', function(){
        $('#showmessage').toggle();
        
    });
    $('#edit_img').hover(function(e){
    	$('#edit_text').show();},
    	function(e){
		$('#edit_text').hide();
    });

    $('#friends_img').hover(function(e){
		$('#friends_text').show();},
		function(e){
		$('#friends_text').hide();
    });
	
	$('#viewcomment').on('click', function(){
		$('#showcomment').toggle();
		
	})
	
 })
