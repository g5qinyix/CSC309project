// app/routes.js



var User = require('../app/models/user');

module.exports = function(app, passport) {
    
	
	
	// =====================================
	// HOME PAGE (every clients can access this) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});
    
	
	
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	
		
	// =====================================
	// FACEBOOK ROUTES LOGIN AND SIGN UP====
	// =====================================
	// route for facebook authentication and login
	app.get('/BeMaster/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	app.get('/BeMaster/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/home',
			failureRedirect : '/login'
		}));	

		
		
		
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form	
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs');
	});	
	
	//sign up for student
	app.get('/studentsignup', function(req, res){
		res.render('studentsignup.ejs', { message: req.flash('signupMessage') });
	});
	
	//sign up for coach
	app.get('/coachsignup', function(req, res){
		res.render('coachsignup.ejs', { message: req.flash('signupMessage') });
	});	
	
	// process the studentsignup form
	app.post('/studentsignup', passport.authenticate('local-signup-student', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/studentsignup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
		
	// process the coachsignup form
	app.post('/coachsignup', passport.authenticate('local-signup-coach', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/coachsignup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	
	
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res){
		//handle student
		if (req.user.local.occupation == "student") {
            res.render('studentprofile.ejs', {
			user : req.user // get the user out of session and pass to template
			});
        }
		//handle coach
		else{
			res.render('coachprofile.ejs', {
			user : req.user // get the user out of session and pass to template
			});	
		}	
	});
	
	
	// Returned to homepage
	app.get('/home', isLoggedIn, function(req, res) {
	res.render('home.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	
	
	// =====================================
	// EDIT PROFILE==============================
	// =====================================
	//
	//show the student edit form
	app.get('/editstudent', isLoggedIn,  function(req, res){
		res.render('editstudent.ejs' ,{
			user: req.user
		});
	});
	
	// process the studentedit form
	app.post('/editstudent', function(req, res){
		var email = req.user.local.email;
		
		//update database
		User.findOne({ 'local.email' :  email }, function(err, user) {
			if (req.param('password') != '') {
                user.local.password = user.generateHash(req.param('password'));
            }
			if (req.param('location') != '') {
				user.local.location = req.param('location');
            }
			if (req.param('nickname') != '') {
				user.local.nickname = req.param('nickname');
            }
			if (req.param('game') != '') {
                user.local.game= req.param('game');
            }
			user.save();
			//update session
			req.login(user, function(err) {
				if (err) return next(err)
				else{
					res.redirect('/profile');
				}
			});
		});														
	});
	
	//show the coach edit form
	app.get('/editcoach', isLoggedIn,  function(req, res){
		res.render('editcoach.ejs' ,{
			user: req.user
		});
	});
	
	// process coach edit form
	app.post('/editcoach', function(req, res){
		var email = req.user.local.email;
		//update database
		User.findOne({ 'local.email' :  email }, function(err, user) {
			if (req.param('password') != '') {
                user.local.password = user.generateHash(req.param('password'));
            }
			if (req.param('location') != '') {
				user.local.location = req.param('location');
            }
			if (req.param('nickname') != '') {
				user.local.nickname = req.param('nickname');
            }
			if (req.param('game') != '') {
                user.local.nickname = req.param('game');
            }
			if (req.param('rate') != '') {
                user.local.rate = req.param('rate');
            }		
			user.save();
			//update session
			req.login(user, function(err) {
				if (err) return next(err)
				else{
					res.redirect('/profile');
				}
			});
		});														
	});

	
	
	// =====================================
	// GAMES ==============================
	// =====================================
	app.get('/game/lol', function(req, res) {
	res.render('lol.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	app.get('/game/dota2', function(req, res) {
	res.render('dota2.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	app.get('/game/csgo', function(req, res) {
	res.render('csgo.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	app.get('/game/overwatch', function(req, res) {
	res.render('overwatch.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	
	
	

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};



// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
