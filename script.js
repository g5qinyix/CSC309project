
var string =  window.location.search;
if (string != '') {
    var name = "Hi ";
    name  += string.substring(string.indexOf('=')+1, string.indexOf('&'));
    var para = document.createElement("li");
    var link = document.createElement('a');
    var node = document.createTextNode(name);
    link.appendChild(node);
    para.appendChild(link);
    var element= document.getElementById('nav');
    element.appendChild(para);
}

