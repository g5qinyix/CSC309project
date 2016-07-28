// server.js
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app=module.exports= express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var compression = require('compression');
var User     = require('./app/models/user');


// configuration ===============================================================
mongoose.connect('mongodb://heroku_7wd41t3s:3j5sv89q5p26ot7db3sokdr68p@ds031965.mlab.com:31965/heroku_7wd41t3s'); // connect to our database
require('./config/passport')(passport); // pass passport for configuration


//admin setting
User.findOne({ 'local.email' :  'admin@bemaster.com' }, function(err, user) {
    // if there are any errors, return the error
    if (err)
        throw err
    // check to see if theres is a message with that id
    if (!user) {
        var admin = new User();
        admin.local.email = "admin@bemaster.com";
        admin.local.password = admin.generateHash('admin');
        admin.local.occupation = "administrator";
        admin.local.nickname = "TeamCSC309";
        admin.save();
    }
})



app.configure(function() {
    // set up our express application
    // use GZIP in Express (performance improved)
    app.use(compression());
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms
    app.set('view engine', 'ejs'); // set up ejs for templating
    // required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
});


//serve static file css/scripts(performance)
app.use(express.static( 'public', {
    maxAge: 86400000
    }));

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
