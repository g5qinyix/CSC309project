//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/mydb';


// Use connect method to connect to the Server

var express = require('express');
var app = express();

//static file css and scripts served for html
app.use(express.static('public'));


//homepage
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/" +'index.html');
});


//login
app.get('/login.html', function(req, res) {
   res.sendFile( __dirname + "/" +'html/login.html');
   
});


//signup
app.get('/signup.html', function(req, res){
   res.sendFile(__dirname + "/" +'html/signup.html');
});


//signup submit
app.get('/registration', function(req, res){
   var email = req.query.email;
   var username = req.query.username;
   req.session.user = usernmae;
   var password = req.query.password;
   var repassword = req.query.repassword;
   var language =  req.query.language;
   var occupation = req.query.occupation;
   //save new user to database
   MongoClient.connect(url, function(err, db){
      if (err) {
         console.log('Unable to connect to the mongoDB server. Error:', err);
      }
      else{
          var collection = db.collection('users');
          var user = {email: email, name: username, password: password, language: language, occupation:
          occupation};
          collection.insert(user, function(){
              if (err) {
               console.log(err);
              }
      });
      }
   });
   res.send(username);

   
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});








    
    

