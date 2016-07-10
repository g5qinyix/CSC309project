

var string =  window.location.search;
if (string != '') {
    var name  = string.substring(string.indexOf('=')+1, string.indexOf('&'));
    document.getElementById("username").innerHTML = name;
    document.getElementById('login').innerHTML = "Log Out";
}

