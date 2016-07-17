$("#reply").click(writing)

function writing(){
	if($(".reply_box").css("display") == "none"){
		$(".reply_box").show("slow");
	}
	else{
		$(".reply_box").hide("slow");
	}
}
