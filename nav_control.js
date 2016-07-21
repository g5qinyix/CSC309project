$(function(){  
        console.log("11111");
        $(function () {  
            $(window).scroll(function(){  
                if ($(window).scrollTop()>100){  
                    $("#upwards").fadeIn(1500);  
                }  
                else  
                {  
                    $("#upwards").fadeOut(1500);  
                }  
            });  
  
            $("#upwards").click(function(){  
                $('body,html').animate({scrollTop:0},100);  
                return false;  
            });  
        });  
    });  