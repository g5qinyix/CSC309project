
//handle homepage for user
$(document).ready(function(){
       var url  = '/getusername';
            $.ajax({
            url,
            type: 'GET',
            success: function(data){
                var line = document.createElement("li");
                var link = document.createElement("a");
                var name = JSON.parse(data);
                link.innerHTML ="Hi " + name;
                line.appendChild(link);
                var navigator = document.getElementById("nav");
                navigator.appendChild(line);
                var login = document.getElementById("login");
                login.innerHTML = "Logout";     
            }
        });
});

