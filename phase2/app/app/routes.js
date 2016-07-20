// app/routes.js



var User       		= require('../app/models/user');

module.exports = function(app, passport) {



	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
        User.find({ "local.occupation": "coach"},function(err, users){
            res.render("index.ejs", {
                users : users
            })
        });  
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
	
	app.get('/coachsignup', function(req, res){
		res.render('coachsignup.ejs', { message: req.flash('signupMessage') });
	});
	
	
	
	// process the studentsignup form
	app.post('/studentsignup', passport.authenticate('local-signup-student', {
		successRedirect : '/home', // redirect to the secure profile section
		failureRedirect : '/studentsignup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	
	
	
	// process the studentsignup form
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
        users = {};
        users['user'] = req.user;
        console.log(users.user);
        User.find({ "local.occupation": "coach", "local.game":req.user.local.game},function(err, user){
            if (err) {
                return next(err);
                //code
            }
            users['coachlist'] = user;
            res.render("home.ejs", {
                users : users
            });
        });
	});
	
	
	
	// =====================================
	// EDIT PROFILE=========================
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

            if (err) {
                return next(err);
                //code
            }
            if (req.param('password') != '') {
                user.local.password = user.generateHash(req.param('password'));     
            }
            if (req.param('location') != '') {
                user.local.location = req.param('location');
            }
            if ( req.param('nickname') != '') {
                user.local.nickname = req.param('nickname');
            }
            if ( req.param('game') != '') {
                user.local.game = req.param('game');
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

            if (err) {
                return next(err);
                //code
            }
			if (req.param('password') != '') {
                user.local.password = user.generateHash(req.param('password'));     
            }
            if (req.param('location') != '') {
                user.local.location = req.param('location');
            }
            if ( req.param('nickname') != '') {
                user.local.nickname = req.param('nickname');
            }
            if ( req.param('game') != '') {
                user.local.game = req.param('game');
            }
            if (req.param('rate')) {
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
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    
    
    
    
    
    // =====================================
	// view a user with userid==========================
	// =====================================
    app.get('/users/*', function(req, res) {
        var url = req.url;
        var id = url.substring();
        cos
        //find this user from database
        res.render('viewcoach.ejs',{
            user:req.user
        })
        
    });
       

	
	
	// =====================================
	// SEARCH COACHES ======================
	// =====================================
	
	//show the search form
	
	app.get('/search', isLoggedIn,function(req, res){
		res.render('search.ejs' ,{
			user: req.user
		});
	});
	
	
	// process the search form
	app.post('/search', function(req, res){
		var email = req.user.local.email;
		var gameName = req.param('gamename');
		var cost = req.param('cost');
		console.log(gameName);
		User.findOne({'local.game' : gameName }, function(err, coach) {
		  if (err) return next(err)
		  else {
			console.log(coach);
		    res.render('searchresult.ejs', {
			coach: coach,
			user: req.user
		    });
		  }	
		});							
	});

};

   
    
// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
    else
	// if they aren't redirect them to the home page
	res.redirect('/');
}
