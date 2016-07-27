// app/routes.js


// import schema for user, comment and message
var User       		= require('../app/models/user'); 
var Comment         = require('../app/models/comment');
var Message         = require('../app/models/message');
var fs     = require('fs');
var path     = require('path');

module.exports = function(app, passport) {
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {  
            res.render("home.ejs",{
                user: null
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
	// Facebook login ======================
	// =====================================
	// =====================================
	// FACEBOOK ROUTES =====================
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
	// Game pages =====================
	// =====================================
    app.get('/games/*', function(req, res){
        var url = req.url;
        var game = url.substring(7);
        var Game;

        if (game=='lol') {
                Game='League of Legends'
        }
        if (game=='dota2') {
                Game='Dota2'
        
        }
        if (game=='csgo') {
                Game='CS:GO'

        }
        
        if (game=='overwatch') {
                Game='Overwatch' 
        }
        
        if (req.isAuthenticated()){
                User.find({'local.occupation':'coach', 'local.game': Game,
                   'local.email': {$ne: req.user.local.email } }).
                sort({'local.rate.grade': -1}).limit(4).exec(function(err, coaches){          
                        res.render('game.ejs',{
                        coaches: coaches,
                        user: req.user,
                        gameName: game,
                        coachtype: null,
                        cost : null
                        });
                   });
        }
        
        else{   
                User.find({'local.occupation':'coach', 'local.game': Game}).
                sort({'local.rate.grade': -1}).limit(4).exec(function(err, coaches){
                        console.log(coaches);
                res.render('game.ejs', {   
                        coaches: coaches,
                        user: null,
                        gameName: game,
                        coachtype: null,
                        cost : null
                        });
                });
        }
    });
    
    
    
    
    
    // =====================================
	// SEARCH COACHES ======================
	// =====================================	   
	// process the search form
	app.post('/search', function(req, res){
		var gameName = req.param('gamename');
        var Game;
		var cost = req.param('cost');
        var coachtype =req.param('coachtype');
		var lowlimit;
		var highlimit;
        
		if (gameName=='lol') {
                Game='League of Legends';
        }
        if (gameName=='dota2') {
                 Game='Dota2';
        
        }
        if (gameName=='csgo') {
                Game='CS:GO';

        }
        
        if (gameName=='overwatch') {
                Game='Overwatch';  
        }
        
		switch(true){
  			case cost == 'Free':
				lowlimit = -1;
				highlimit = 1;
				break;
			case cost == '$1-$10':
				lowlimit = 0;
				highlimit = 11;
				break;
			case cost == '$11-$20':
				lowlimit = 10;
				highlimit = 21;
				break;
			case cost == '$21-$30':
				lowlimit = 20;
				highlimit = 31;
				break;
			case cost == '>$30':
				lowlimit = 30;
				highlimit = 100;
				break;
			case cost == 'All':
				lowlimit = -1;
				highlimit = 100;    
		}
        
        if (req.isAuthenticated()){
                User.find({'local.game' : Game,
				   'local.occupation':'coach',
                   'local.coachtype': coachtype,
				   'local.cost': { $gt: lowlimit, $lt: highlimit},
                   'local.email': {$ne: req.user.local.email} }, function(err, coaches) {
                        if (err){       
                         console.log("some error");
                        }    
                        else {
                               res.render('game.ejs', {
                                coaches: coaches,
                                user: req.user,
                                //search part
                                gameName: gameName,
                                coachtype: coachtype,
                                cost : cost
                                });
                        }
                   })
         }
         else{
                User.find({'local.game' : Game,
				   'local.occupation':'coach',
                    'local.coachtype': coachtype,
				   'local.cost': { $gt: lowlimit, $lt: highlimit}}, function(err, coaches) {
                        if (err){       
                         console.log("some error");
                        }
                        else{
                                res.render('game.ejs', {
                                coaches: coaches,
                                user: null,
                                //search part
                                gameName: gameName,
                                coachtype: coachtype,
                                cost : cost
                                });
                        }
                   });
                }
     
        });
    
    

    
    
    
    
	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res){
        
		//handle student  
		if (req.user.local.occupation == "student") {
                res.render('studentprofile.ejs', {
                           user : req.user
                           });
         
        }
        
		//handle coach
		else{
            // Coach can view comments to him on profile
            // get comments from database
            Comment.find({'coachid': req.user._id}, function(err, comments){
                	res.render('coachprofile.ejs', {
                        user : req.user,
                        comments : comments 
                    });	
            }); 
		}	
	});
		
    
	// Returned to homepage
	app.get('/home', isLoggedIn, function(req, res) {
            res.render("home.ejs", {
                user: req.user
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
            if ( req.param('nickname') != '') {
                user.local.nickname = req.param('nickname');
            }
            if ( req.param('game') != '') {
                user.local.game = req.param('game');
            }
            
            if(req.files.photo.name != ''){  
                //read new image file
                fs.readFile(req.files.photo.path, function(err, data){
                var imageName = req.files.photo.name;
                       if(!imageName){
                            console.log("There was an error");
                        }else{
                            var newPath =  path.join(__dirname, '../public/tmp', req.user.local.email+imageName);
                            console.log(newPath);
                            fs.writeFile(newPath, data, function(err){
                                if (err) {
                                    console.log("err");
                                    }
                                });
                            }
                });
                
                
                if ( user.local.photo != '') {
                        //delete old images
                        var oldPath = path.join(__dirname, '../public', user.local.photo);
                        fs.unlinkSync(oldPath);
                }      
                //save the url to user photo field
                user.local.photo = '/tmp/'+ req.user.local.email+req.files.photo.name;     
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
            if ( req.param('game') != '' ) {
                user.local.game = req.param('game');
            }
            if (req.param('cost') != '' ) {
                user.local.cost = req.param('cost');
            }
            
            if ( req.param('coachtype') != '') {
                user.local.coachtype = req.param('coachtype');
            }
            
            if( req.files.photo.name != ''){  
                //read new image file
                fs.readFile(req.files.photo.path, function(err, data){
                var imageName = req.files.photo.name;
                       if(!imageName){
                            console.log("There was an error");
                        }else{
                            var newPath =  path.join(__dirname, '../public/tmp', req.user.local.email+imageName);
                            console.log(newPath);
                            fs.writeFile(newPath, data, function(err){
                                if (err) {
                                    console.log("err");
                                    }
                                });
                            }
                    });
                
                if ( user.local.photo != '') {
                  
                //delete old images
                var oldPath = path.join(__dirname, '../public', user.local.photo);
                fs.unlinkSync(oldPath);
                }
                
                //save the url to user photo field
                user.local.photo = '/tmp/'+ req.user.local.email+req.files.photo.name;
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
	// view user information===============
	// =====================================
    // including coach and student
    app.get('/users/*', checkLogin, function(req, res) {
        var url = req.url;
        var id = url.substring(7);
        if (id == req.user._id) {
                res.redirect('/profile');
        }
        else{
        //find this user from database
        var has_followed = 0;
        for(var i = 0; i < req.user.local.follow.length; i++){
            if (req.user.local.follow[i] == id){
                has_followed = 1;
            }
        }
        console.log(id);
        User.findOne({ '_id' :  id }, function(err, user) {
                 if (err) {
                        console.log(err);
                        }    
                console.log(user.local.occupation);     
                if (user.local.occupation =="student") {
                        res.render('viewstudent.ejs', {
                                student : user,
                                user : req.user,
                                friend_list :  req.user.local.follow,
                                has_followed : has_followed
                        });
                        
                } 
                //this user is a coach
                else{
                        //find all comments about this coach
                        Comment.find({'coachid': id}, function(err, comments){
                                if (err) {
                                        console.log(err);
                                        } 
                                res.render('viewcoach.ejs',{
                                        user: req.user,
                                        coach:user,
                                        comments: comments,
                                        friend_list : req.user.local.follow,
                                        has_followed :  has_followed
                                });
                        });
                }
        });
        }
    });

    app.get('/follow/*', checkLogin, function(req, res){
        var url = req.url;
        var id = url.substring(8);
        var email = req.user.local.email;
        User.findOne({ '_id' :  id }, function(err, user){
            if (err){
                console.log(err);
            }
        });
        User.findOne({ 'local.email' :  email }, function(err, user){
            user.local.follow.push(id);
            console.log(user.local.follow);
            user.save();
            req.login(user, function(err) {
                if (err) return next(err)
                else{
                    res.redirect('/users/'+id);
                   
                }
            });
        
        });
    });
    app.get('/unfollow/*', checkLogin, function(req, res){
        var url = req.url;
        var id = url.substring(10);
        var email = req.user.local.email;
        User.findOne({ '_id' :  id }, function(err, user){
            if (err){
                console.log(err);
            }
        });
        var index;
        User.findOne({ 'local.email' :  email }, function(err, user){
            for (var i = 0; i < user.local.follow.length; i++){
                if (id == user.local.follow[i]){
                    index = i;
                }
            }
            user.local.follow.splice(index, 1);
            console.log(user.local.follow);
            user.save();
            req.login(user, function(err) {
                if (err) return next(err)
                else{
                    res.redirect('/friend');
                   
                }
            });
        
        });
    });

    app.get('/friend', isLoggedIn, function(req, res){
 
            var friend_list = req.user.local.follow;
            User.find({'_id' : { $in: friend_list}}, function(err,coaches){
            res.render('friend.ejs', {
                coaches: coaches,
                user: req.user
            });
        });
})    

     app.get('/order/*', checkLogin, function(req, res){
        var url = req.url;
        var id = url.substring(7);
        var today=new Date();
        var h=today.getHours();
        User.findOne({'_id' : id}, function(err, user){
            console.log(user.local.schedule);
            if (user.local.schedule._23_00[0] == 'passed' && h != 23){
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._10_11.set(i, "0");
                    }
                    else{
                     user.local.schedule._10_11.set(i, user.local.schedule._10_11[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._11_12.set(i, "0");
                    }
                    else{
                     user.local.schedule._11_12.set(i, user.local.schedule._11_12[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._12_13.set(i, "0");
                    }
                    else{
                     user.local.schedule._12_13.set(i, user.local.schedule._12_13[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._13_14.set(i, "0");
                    }
                    else{
                     user.local.schedule._13_14.set(i, user.local.schedule._13_14[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._14_15.set(i, "0");
                    }
                    else{
                     user.local.schedule._14_15.set(i, user.local.schedule._14_15[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._15_16.set(i, "0");
                    }
                    else{
                     user.local.schedule._15_16.set(i, user.local.schedule._15_16[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._16_17.set(i, "0");
                    }
                    else{
                     user.local.schedule._16_17.set(i, user.local.schedule._16_17[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._17_18.set(i, "0");
                    }
                    else{
                     user.local.schedule._17_18.set(i, user.local.schedule._17_18[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._18_19.set(i, "0");
                    }
                    else{
                     user.local.schedule._18_19.set(i, user.local.schedule._18_19[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._19_20.set(i, "0");
                    }
                    else{
                     user.local.schedule._19_20.set(i, user.local.schedule._19_20[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._20_21.set(i, "0");
                    }
                    else{
                     user.local.schedule._20_21.set(i, user.local.schedule._20_21[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._21_22.set(i, "0");
                    }
                    else{
                     user.local.schedule._21_22.set(i, user.local.schedule._21_22[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._22_23.set(i, "0");
                    }
                    else{
                     user.local.schedule._22_23.set(i, user.local.schedule._22_23[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._23_00.set(i, "0");
                    }
                    else{
                     user.local.schedule._23_00.set(i, user.local.schedule._23_00[i + 1]);
                    }
                }
                user.save();
            }
            User.findOne({'_id' : req.user._id}, function(err,user){
                req.login(user, function(err) {
                    if (err) return next(err)
                });
            });
            res.render('order.ejs',{
                user: req.user,
                target_coach: user,
                _10_11: user.local.schedule._10_11,
                _11_12: user.local.schedule._11_12,
                _12_13: user.local.schedule._12_13,
                _13_14: user.local.schedule._13_14,
                _14_15: user.local.schedule._14_15,
                _15_16: user.local.schedule._15_16,
                _16_17: user.local.schedule._16_17,
                _17_18: user.local.schedule._17_18,
                _18_19: user.local.schedule._18_19,
                _19_20: user.local.schedule._19_20,
                _20_21: user.local.schedule._20_21,
                _21_22: user.local.schedule._21_22,
                _22_23: user.local.schedule._22_23,
                _23_00: user.local.schedule._23_00
            });
        });
     });

    app.get('/myschedule', function(req, res){
        var today=new Date();
        var h=today.getHours();
        User.findOne({'_id' : req.user._id}, function(err, user){
            if (user.local.schedule._23_00[0] == 'passed' && h != 23){
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._10_11.set(i, "0");
                    }
                    else{
                     user.local.schedule._10_11.set(i, user.local.schedule._10_11[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._11_12.set(i, "0");
                    }
                    else{
                     user.local.schedule._11_12.set(i, user.local.schedule._11_12[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._12_13.set(i, "0");
                    }
                    else{
                     user.local.schedule._12_13.set(i, user.local.schedule._12_13[i + 1]);
                    }
                }
                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._13_14.set(i, "0");
                    }
                    else{
                     user.local.schedule._13_14.set(i, user.local.schedule._13_14[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._14_15.set(i, "0");
                    }
                    else{
                     user.local.schedule._14_15.set(i, user.local.schedule._14_15[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._15_16.set(i, "0");
                    }
                    else{
                     user.local.schedule._15_16.set(i, user.local.schedule._15_16[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._16_17.set(i, "0");
                    }
                    else{
                     user.local.schedule._16_17.set(i, user.local.schedule._16_17[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._17_18.set(i, "0");
                    }
                    else{
                     user.local.schedule._17_18.set(i, user.local.schedule._17_18[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._18_19.set(i, "0");
                    }
                    else{
                     user.local.schedule._18_19.set(i, user.local.schedule._18_19[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._19_20.set(i, "0");
                    }
                    else{
                     user.local.schedule._19_20.set(i, user.local.schedule._19_20[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._20_21.set(i, "0");
                    }
                    else{
                     user.local.schedule._20_21.set(i, user.local.schedule._20_21[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._21_22.set(i, "0");
                    }
                    else{
                     user.local.schedule._21_22.set(i, user.local.schedule._21_22[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._22_23.set(i, "0");
                    }
                    else{
                     user.local.schedule._22_23.set(i, user.local.schedule._22_23[i + 1]);
                    }
                }
                                for (var i = 0; i < 7; i ++){
                    if (i == 6){
                        user.local.schedule._23_00.set(i, "0");
                    }
                    else{
                     user.local.schedule._23_00.set(i, user.local.schedule._23_00[i + 1]);
                    }
                }
                user.save();
            }
            User.findOne({'_id' : req.user._id}, function(err,user){
                req.login(user, function(err) {
                    if (err) return next(err)
                });
            });
        res.render('myschedule.ejs',{
            user: req.user,
            _10_11: req.user.local.schedule._10_11,
            _11_12: req.user.local.schedule._11_12,
            _12_13: req.user.local.schedule._12_13,
            _13_14: req.user.local.schedule._13_14,
            _14_15: req.user.local.schedule._14_15,
            _15_16: req.user.local.schedule._15_16,
            _16_17: req.user.local.schedule._16_17,
            _17_18: req.user.local.schedule._17_18,
            _18_19: req.user.local.schedule._18_19,
            _19_20: req.user.local.schedule._19_20,
            _20_21: req.user.local.schedule._20_21,
            _21_22: req.user.local.schedule._21_22,
            _22_23: req.user.local.schedule._22_23,
            _23_00: req.user.local.schedule._23_00

        });
     });
});

    /*app.post('/view_s', function(req, res){
        var email = req.user.local.email;
        //update database
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
                return next(err);
                //code
            }
            var days = [0,1,2,3,4,5,6];
            var times = ["_10-11", "_11-12","_12-13","_13-14","_14-15","_15-16","_16-17","_17-18","_18-19","_19-20","_20-21","_21-22","_22-23","_23-00"]
            for (var a = 0; a < days.length; a ++){
                for (var b = 0; b < times.length; b ++){
                    var time = times[b];
                    var day = days[a];
                    var combination = day + time;
                    if(req.param(combination) != undefined){
                        if(time == "_10-11"){
                            user.local.schedule._10_11.set(a, "1");
                        }
                        if(time == "_11-12"){
                            user.local.schedule._11_12.set(a, "1");
                        }
                        if(time == "_12-13"){
                            user.local.schedule._12_13.set(a, "1");
                        }
                        if(time == "_13-14"){
                            user.local.schedule._13_14.set(a, "1");
                        }
                        if(time == "_14-15"){
                            user.local.schedule._14_15.set(a, "1");
                        }
                        if(time == "_15-16"){
                            user.local.schedule._15_16.set(a, "1");
                        }
                        if(time == "_16-17"){
                            user.local.schedule._16_17.set(a, "1");
                        }
                        if(time == "_17-18"){
                            user.local.schedule._17_18.set(a, "1");
                        }
                        if(time == "_18-19"){
                            user.local.schedule._18_19.set(a, "1");
                        }
                        if(time == "_19-20"){
                            user.local.schedule._19_20.set(a, "1");
                        }
                        if(time == "_20-21"){
                            user.local.schedule._20_21.set(a, "1");
                        }
                        if(time == "_21-22"){
                            user.local.schedule._21_22.set(a, "1");
                        }
                        if(time == "_22-23"){
                            user.local.schedule._22_23.set(a, "1");
                        }
                        if(time == "_23-00"){
                            user.local.schedule._23_00.set(a, "1");
                        }
                    }
                    else{
                        if(time == "_10-11"){
                            user.local.schedule._10_11.set(a, "0");
                        }
                        if(time == "_11-12"){
                            user.local.schedule._11_12.set(a, "0");
                        }
                        if(time == "_12-13"){
                            user.local.schedule._12_13.set(a, "0");
                        }
                        if(time == "_13-14"){
                            user.local.schedule._13_14.set(a, "0");
                        }
                        if(time == "_14-15"){
                            user.local.schedule._14_15.set(a, "0");
                        }
                        if(time == "_15-16"){
                            user.local.schedule._15_16.set(a, "0");
                        }
                        if(time == "_16-17"){
                            user.local.schedule._16_17.set(a, "0");
                        }
                        if(time == "_17-18"){
                            user.local.schedule._17_18.set(a, "0");
                        }
                        if(time == "_18-19"){
                            user.local.schedule._18_19.set(a, "0");
                        }
                        if(time == "_19-20"){
                            user.local.schedule._19_20.set(a, "0");
                        }
                        if(time == "_20-21"){
                            user.local.schedule._20_21.set(a, "0");
                        }
                        if(time == "_21-22"){
                            user.local.schedule._21_22.set(a, "0");
                        }
                        if(time == "_22-23"){
                            user.local.schedule._22_23.set(a, "0");
                        }
                        if(time == "_23-00"){
                            user.local.schedule._23_00.set(a, "0");
                        }
                    }
                }
            }
            user.save();
            //update session
            req.login(user, function(err) {
                if (err) return next(err)
                else{
                    res.redirect('/myschedule');
                }
            });
        });                                              
    });
    */
    app.post('/transaction/*', function(req, res){
        var url = req.url;
        var id = url.substring(13);
        //update database
        var money = 0;
        var cost = 0;
        var target_coach;
        var target_coach_id;
        User.findOne({ '_id' :  id }, function(err, user) {
            if (err) {
                return next(err);
                //code
            }
            target_coach = user.local.nickname;
            target_coach_id = user._id;
            var days = [0,1,2,3,4,5,6];
            var times = ["_10-11", "_11-12","_12-13","_13-14","_14-15","_15-16","_16-17","_17-18","_18-19","_19-20","_20-21","_21-22","_22-23","_23-00"]
            for (var a = 0; a < days.length; a ++){
                for (var b = 0; b < times.length; b ++){
                    var time = times[b];
                    var day = days[a];
                    var combination = day + time;
                    if(req.param(combination) != undefined){
                        if(time == "_10-11"){
                            user.local.schedule._10_11.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_11-12"){
                            user.local.schedule._11_12.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_12-13"){
                            user.local.schedule._12_13.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_13-14"){
                            user.local.schedule._13_14.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_14-15"){
                            user.local.schedule._14_15.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_15-16"){
                            user.local.schedule._15_16.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_16-17"){
                            user.local.schedule._16_17.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_17-18"){
                            user.local.schedule._17_18.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_18-19"){
                            user.local.schedule._18_19.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_19-20"){
                            user.local.schedule._19_20.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_20-21"){
                            user.local.schedule._20_21.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_21-22"){
                            user.local.schedule._21_22.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_22-23"){
                            user.local.schedule._22_23.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                        if(time == "_23-00"){
                            user.local.schedule._23_00.set(a, req.param(combination));
                            if (req.param(combination)!='passed'){
                                money = money + 1;
                            }
                        }
                    }
                }
            }
            cost = money*user.local.cost;
            user.local.pocket = user.local.pocket + cost;
            user.save();
            //update session
            req.login(user, function(err) {
                if (err) return next(err)
            });
        });
        User.findOne({'_id' : req.user._id}, function(err, user){
            user.local.pocket = user.local.pocket - cost;
            user.local.recent_orders.push(target_coach);
            user.local.recent_orders.push(cost);
            if (user.local.recent_orders.length > 10){
                user.local.recent_orders.splice(0,2);
            }
            user.save();
            req.login(user, function(err) {
            if (err) return next(err)
                else{
                    res.render('confirmation.ejs',{
                        money : cost,
                        target_coach: target_coach,
                        target_coach_id : target_coach_id
                    });
                }
            });
            var newMessage = new Message(); 
            newMessage.sender.id = user._id;
            newMessage.receiver.id = id;
            newMessage.sender.content = req.user.local.nickname + "book a reservation" + ", sending you " + cost + " dollars";
            newMessage.receiver.content = req.user.local.nickname + "book a reservation" + ", sending you " + cost + " dollars";
            newMessage.receiver.status=0;
            var date = new Date();
            newMessage.date = date;
            newMessage.save();   
        });                                             
    });
	

    
         
	// =====================================
	// Comment and rating system ======================
	// =====================================
  
    // users add comments to coach
	app.post('/comments/*', isLoggedIn, function(req, res){
        //get the id of coach to be commented
        var url = req.url;
        var coachid = url.substring(10);
        var content = req.param("comment");
        var rate = req.param('rate');
        var newComment  = new Comment();
        var date = new Date();
        newComment.coachid = coachid;
        newComment.comment.studentid = req.user._id;
        newComment.comment.nickname = req.user.local.nickname;
        newComment.comment.content = content;
        newComment.comment.date = date;
        newComment.save();
        
        // handle rate(each coach has to get at least 3 times rate in order to get grade)
        User.findOne({'_id': coachid}).exec(function(err, coach){
                if (coach.local.rate.studentlist.indexOf(req.user._id) == -1) {  
                        coach.local.rate.list.push(rate);
                        if (coach.local.rate.list.length >= 3) {
                                var total = 0;
                                for(var i = 0; i < coach.local.rate.list.length; i++) {
                                    total += coach.local.rate.list[i];
                                    }
                                var avg = (total / coach.local.rate.list.length).toFixed(2);
                                coach.local.rate.grade = avg;
                                }
                                
                                //add student to studentlist
                                coach.local.rate.studentlist.push(req.user._id);      
                        }
                coach.save();
                res.redirect('/users/'+coachid);
        }); 
    });
    

    
    
    
    
    
    
    
    // =====================================
	// Message system ======================
	// =====================================
    //send a message to a user
    app.post('/message/*', isLoggedIn, function(req,res){
        var url = req.url;
        var receiverid = url.substring(9);
        var date = new Date();
        var newMessage = new Message();
        newMessage.sender.id = req.user._id;
        newMessage.receiver.id = receiverid;
        newMessage.sender.content = req.param("content");
        newMessage.receiver.content = req.param("content");
        newMessage.receiver.status=0;
        newMessage.date = date;
        newMessage.save();
        console.log(receiverid);
        User.findOne({'_id' : receiverid}).exec(function(err, user){
                console.log("receiver id: " + user);
                
        });
        
        res.redirect('/users/'+receiverid);
    });
    
    
    //repley in a conservation
    app.post('/repley/*', isLoggedIn, function(req,res){
        var url = req.url;
        var receiverid = url.substring(8);
        var date = new Date();
        var newMessage = new Message();
        newMessage.sender.id = req.user._id;
        newMessage.receiver.id = receiverid;
        newMessage.sender.content = req.param("repley");
        newMessage.receiver.content = req.param("repley");
        newMessage.receiver.status= 0;
        newMessage.date = date;
        newMessage.save();
        
        res.redirect('/viewmessage/'+receiverid);
    });
    
    
    
    
    //user view contact list

    app.get('/messaging', isLoggedIn, function(req, res){

        //get contact list from database
         Message.find({'sender.id': req.user._id}).distinct('receiver.id').exec(function(err, receivers){
                     console.log(receivers);
            Message.find({'receiver.id': req.user._id}).distinct('sender.id').exec(function(err, senders){
                console.log(senders);
                for(i=0; i<senders.length; i++){
                    if (receivers.indexOf(senders[i]) == -1) {
                        receivers.push(senders[i]);
                        }
                } 
                Message.find({'receiver.id': req.user._id, 'receiver.status' : 0}).

                             distinct('sender.id').exec(function(err, unread){
                             
                                    User.find({ '_id': { $in: receivers } }, function(err, users){
                                   

                                        res.render('message.ejs', {   
                                                unreads : unread,
                                                targetid: null,
                                                contacters: users,
                                                user: req.user,
                                                conservations: null
                                                });
                                        });
                                });
                        });
            });
    });
    
    
    
    //user view all messages with one contact
    app.get('/viewmessage/*', isLoggedIn, function(req, res){
         var url = req.url;
         var contactid = url.substring(13);
         // get the contact list
      
        //find all messages between user and one contact
        Message.find({ $or: [{$and: [ { 'sender.id': req.user._id }, { 'receiver.id': contactid} ] },
                             {$and: [ { 'sender.id': contactid }, { 'receiver.id': req.user._id} ] }]
                     }).sort({'date': 1}).exec(function(err, conservations){
                //update message status
                Message.update({'sender.id': contactid, 'receiver.status':0}, {'receiver.status': 1},
                               {multi: true}, function(err){
                                Message.find({'sender.id': req.user._id}).distinct('receiver.id').exec(function(err, receivers){
                                        Message.find({'receiver.id': req.user._id}).distinct('sender.id').exec(function(err, senders){
                                                for(i=0; i<senders.length; i++){
                                                        if (receivers.indexOf(senders[i]) == -1) {
                                                                receivers.push(senders[i]);
                                                                }
                                                }
                                                //get the contact list from database
                                                Message.find({'receiver.id': req.user._id,
                                                             'receiver.status' : 0}).distinct('sender.id').exec(function(err, unread){
                                                        User.find({ '_id': { $in: receivers } }, function(err, users){
                                                                User.findOne({'_id': contactid}, function(err, targetuser){
                                                                        res.render('message.ejs',{
                                                                                unreads : unread,
                                                                                targetid:  contactid,
                                                                                conservations:conservations,
                                                                                user: req.user,
                                                                                contacters :users,
                                                                                targetuser: targetuser
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                });
                        });
        });
    });


                                                         
    
    
    
    
    // =====================================
	// ADMIN LOGIN =========================
	// =====================================
	// show the admin-login form
	app.get('/admin', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('adminlogin.ejs', { message: req.flash('loginMessage') });
	});


	// process the login form
	app.post('/admin', passport.authenticate('admin-login', {
		successRedirect : '/adminpage', // redirect to the secure admin page
		failureRedirect : '/admin', // redirect back to the admin-login page if there is an error
		failureFlash : true // allow flash messages 
	}));
    
    // show admin page
	app.get('/adminpage', isLoggedIn, function(req, res) {
		// render the adminpage and pass in any flash data if it exists
        if (req.user.local.email == 'admin@bemaster.com') {
            res.render('admin.ejs', { message: req.flash('loginMessage') });
        } else {
            res.render('adminlogin.ejs', { message: req.flash('loginMessage')});
        } 
	});
    
    //show the change password form
	app.get('/changepassword', isLoggedIn,  function(req, res){
		res.render('changepassword.ejs' ,{
			user: req.user
		});
	});
    
    
    // process the change password form
	app.post('/changepassword', function(req, res){
		var email = req.user.local.email;
		//update database
		User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) {
                return next(err);
            } else {
                user.local.password = user.generateHash(req.param('newpassword'));
                user.save();
                res.render('changepasswordsuccess.ejs');
            }
		});													
	});
	
    
    //show the add user form
	app.get('/adduser', isLoggedIn,  function(req, res){
        if (req.user.local.email == 'admin@bemaster.com') {
            res.render('adduser.ejs');
        } else {
            res.render('adminlogin.ejs', { message: req.flash('loginMessage')});
        };
	});
    
    //show the add stuent form
	app.get('/addstudent', isLoggedIn,  function(req, res){
        if (req.user.local.email == 'admin@bemaster.com') {
            res.render('addstudent.ejs', { message: req.flash('signupMessage')});
        } else {
            res.render('adminlogin.ejs', { message: req.flash('loginMessage')});
        };
	});
    
    // process the add student form
    app.post('/addstudent', function(req, res) {
        var email = req.param('email');
        
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return next(err)
            // check to see if theres already a user with that email
            if (user) {
                res.render('addstudent.ejs', {message: ('signupMessage', 'That email is already taken.')});
            } else {
                // if there is no user with that email
                // create the user
                var newUser  = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(req.param('password')); // use the generateHash function in our user model
                // parse the url
                newUser.local.location = req.param('location');
                newUser.local.nickname = req.param('nickname');
                newUser.local.game = req.param('game');
                newUser.local.occupation = 'student';
                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.render('addstudentsuccess.ejs');
                    }
                });
            }
        })
    });
    
    //show the add coach form
	app.get('/addcoach', isLoggedIn,  function(req, res){
        if (req.user.local.email == 'admin@bemaster.com') {
            res.render('addcoach.ejs', { message: req.flash('signupMessage')});
        } else {
            res.render('adminlogin.ejs', { message: req.flash('loginMessage')});
        };
	});
    
    // process the add coach form
    app.post('/addcoach', function(req, res) {
        var email = req.param('email');
        
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return next(err)
            // check to see if theres already a user with that email
            if (user) {
                res.render('addcoach.ejs', {message: ('signupMessage', 'That email is already taken.')});
            } else {
                // if there is no user with that email
                // create the user
                var newUser  = new User();
                
                 // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(req.param('password'));
                newUser.local.nickname = req.param('nickname');
                newUser.local.location = req.param('location');
                newUser.local.occupation = 'coach';
                newUser.local.game = req.param('game');
                newUser.local.cost = req.param('cost');
                newUser.local.rate.grade = 0;
                newUser.local.rate.list= [];
                newUser.local.coachtype = req.param("coachtype");
                // save the user
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    } else {
                        res.render('addcoachsuccess.ejs');
                    }
                });
            };
        });
    })  
}


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();// if they aren't redirect them to the home page
	res.redirect('/');
}



function checkLogin(req, res, next) {
   if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}
