var flag1 = 0;
var flag2 = 0;
var t = $(window).scrollTop();
function open_game(){
    if (flag1 == 0){
        $("#games").show("slow");
        flag1 = 1;
        $('body,html').animate({'scrollTop':t + $(window).height()},1000);
    }
    else{
        $("#games").hide("slow");
        flag1 = 0;
    }
}

function open_about(){
    if (flag2 == 0){
        $("#about").show("slow");
        flag2 = 1;
        $('body,html').animate({'scrollTop':t + $(window).height()},1000);
    }
    else{
        $("#about").hide("slow");
        flag2 = 0;
    }
}

$(document).ready(function() {
    $("#coach_button").click(open_game);
    $("#about_button").click(open_about);
    
    $(function(){
            $("#banner").height($(window).height());
            $("#banner").width($(window).width());
			});
    
  
});