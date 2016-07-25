// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User       		= require('../app/models/user');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// load the auth variables
var configAuth = require('./auth');
var fs     = require('fs');
var path     = require('path');
// expose this function to our app using module.exports
module.exports = function(passport) {
    
	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    
 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-signup-student', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

				// if there is no user with that email
                // create the user
                var newUser  = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
	            // parse the url
                newUser.local.location = req.param('location');
                newUser.local.nickname = req.param('nickname');
                newUser.local.game = req.param('game');
                newUser.local.occupation = 'student';

                if (req.files.photo.name == '') {
                    newUser.local.photo = '';
                    
                }
                else{
                    
                    //read image file
                    fs.readFile(req.files.photo.path, function(err, data){
                        var imageName = req.files.photo.name;
                        if(!imageName){
                            console.log("There was an error");
                        }else{
                            var newPath =  path.join(__dirname, '../public/tmp', email+imageName);
                            console.log(newPath);
                            fs.writeFile(newPath, data, function(err){
                                if (err) {
                                    console.log("err");
                                }
                                });
                            }
                    });
                    
                    //save the url to user photo field
                    newUser.local.photo = '/tmp/'+ email+req.files.photo.name;
                    
                }
                
                // save the user         
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
                
            }

        });

    }));
    
    
    //coach Sign up
    passport.use('local-signup-coach', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

		// find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {
                // if there is no user with that email
                // create the user
                var newUser  = new User();

				// There are missing fields.
                if (req.param("coachtype") == "Offline" || req.param("coachtype") == "Both"){
                    if (req.param('streetAddress').length == 0 ||
                        req.param('city').length == 0 ||
                        req.param('province').length == 0){
                            return done(null, false, req.flash('signupMessage', 'Must enter all location fields if offline coach.'));
                    }
                    // obtain coordinates of address.
                    var urlAPIKey = "&key=AIzaSyA1IGuTcLPxARLu0f8zLHV5dyDx-6CbSa8";
                    var urlBeginning = "https://maps.googleapis.com/maps/api/geocode/json?address=";
                    var url = urlBeginning + req.param('streetAddress') + "+" + req.param('city') + "+"
                                           + req.param('province') + urlAPIKey; 
                    var jsonHTTP = new XMLHttpRequest();
                    jsonHTTP.open("GET", url, false);
                    jsonHTTP.send(null);
                    var result = JSON.parse(jsonHTTP.responseText);
                    if (result["status"] == "ZERO_RESULTS"){
                        return done(null, false, req.flash('signupMessage', 'Cannot find address'));
                    }
                    else {
                        newUser.local.coordinate.lat = result.results[0]["geometry"]["location"]["lat"];
                        newUser.local.coordinate.lng = result.results[0]["geometry"]["location"]["lng"];

                    }
                    //console.log(jsonHTTP.responseText); 
                    

                }
                

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password); // use the generateHash function in our user model
	            // parse the url
                newUser.local.nickname = req.param('nickname');
                newUser.local.occupation = 'coach';
                newUser.local.game = req.param('game');
                newUser.local.cost = req.param('cost');
                newUser.local.rate.grade = 0;
                newUser.local.rate.list = [];
                newUser.local.coachtype = req.param("coachtype");
                newUser.local.address.street = req.param('streetAddress');
                newUser.local.address.city = req.param('city');
                newUser.local.address.province = req.param('province');

                //read image file
                fs.readFile(req.files.photo.path, function(err, data){
                    var imageName = req.files.photo.name;
                    if(!imageName){
                        console.log("There was an error");
                    }else{
                        var newPath =  path.join(__dirname, '../public/tmp', imageName);
                        console.log(newPath);
                        fs.writeFile(newPath, data, function(err){
                            if (err) {
                                console.log("err");
                                }
                            });
                        }
                });
                
                //save the url to user photo field
                newUser.local.photo = '/tmp/'+ req.files.photo.name;
                  
                if (req.files.photo.name == '') {
                    newUser.local.photo = '';
                }
                
                else{   
                    //read image file
                    fs.readFile(req.files.photo.path, function(err, data){
                        var imageName = req.files.photo.name;
                        if(!imageName){
                            console.log("There was an error");
                        }else{
                            var newPath =  path.join(__dirname, '../public/tmp', email+imageName);
                            console.log(newPath);
                            fs.writeFile(newPath, data, function(err){
                                if (err) {
                                    console.log("err");
                                    }
                                });
                            }
                    });
                    //save the url to user photo field
                    newUser.local.photo = '/tmp/'+ email+req.files.photo.name;
                }
               
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));
    
    
    

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our for

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));
    
    
    
    // =========================================================================
    // ADMIN LOGIN =============================================================
    // =========================================================================

    passport.use('admin-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // admin uses admin@bemaster.com email only
        if (email != 'admin@bemaster.com') {
            return done(null, false, req.flash('loginMessage', 'Sorry, but you are not an administrater.'));
        } else {
            // find a user whose email is admin@bemaster.com
            User.findOne({ 'local.email' :  'admin@bemaster.com' }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No admin found.')); // req.flash is the way to set flashdata using connect-flash
    
                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    
                // all is well, return successful user
                return done(null, user);
            });
        }

    }));
    
    
    
    
    
    
    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    passport.use(new FacebookStrategy({

        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields   : ['id', 'name', 'email'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {

        // asynchronous
        process.nextTick(function() {

            // check if the user is already logged in
            if (!req.user) {

                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        // if there is a user id already but no token (user was linked at one point and then removed)
                        if (!user.facebook.token) {
                            user.facebook.token = token;
                            user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                            user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser            = new User();
                        newUser.facebook.id    = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
                        newUser.local.nickname =   newUser.facebook.name;
                        newUser.local.email =  newUser.facebook.email;
                        newUser.local.occupation = "student";
                        newUser.local.photo = '';
                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });

            }
        });

    }));
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // =========================================================================
    // EDIT File =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('edit-user', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    
    function(req, email, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  req.session.user.local.email }, function(err, user) {
            user.local.password = user.generateHash(req.param('password'));
            user.local.nickname = req.param('nickname');
            user.local.location = req.param('location');
            
            user.save(function(err){
                if (err){
                    console.log('Error in Saving user: '+err);
                    throw err;
              }
              console.log('User Registration succesful');
              return done(null, user);
            });
        });

    }));

};
