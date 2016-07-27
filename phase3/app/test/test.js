var User, app, mongoose, request, server, should, agent;

should   = require("should");
app      = require("../server");
User     = require("../app/models/user");
Message  = require("../app/models/message");
Comment  = require("../app/models/comment");
request  = require("supertest");
agent = request.agent(app)
var path     = require('path');
var fs    = require('fs');


// =====================================
// HOME PAGE (with login links) ========
// =====================================
describe('Homepage', function(){
  describe('Routing: Enter Homepage', function(){
    it("should provide a view name", function(done){
      agent
        .get('/')
        .expect(200)
        .end(done)
      });
    });
});


// =====================================
// Sign up==============================
// =====================================

//Student sign up
//test signup for no duplicate user, each
//user has to sign up with an unique email
describe('Student', function () {
  before(function(done) {
    return done();
    });
  
  describe('Student Sign up test', function () {
    var newPath =  path.join(__dirname +'/person.gif');
 
      it('should redirect to /home', function (done) {
        agent
        .post('/studentsignup')
        .field('email', 'test1@mail.com')
        .field('password', '123456')
        .field('game', 'CS:GO')
        .field('nickname', 'jack')
        .attach('photo',newPath)
        .expect('Location','/home')
        .end(done)
      })
  });
      
  after(function(done) {
      User.findOne({"local.email" : 'test1@mail.com'}).exec(function(err, user){
          var oldPath = path.join(__dirname, '../public', user.local.photo);
          fs.unlinkSync(oldPath);
          user.remove();
           return done();
     
        });
     
    });
})



//Coach sign up --Online
//test signup for no duplicate user, each
//user has to sign up with an unique email
describe('Coach', function () {
  before(function(done) {
    return done();
    });
  describe('Online Coach Sign up test', function () {
    var newPath =  path.join(__dirname+'/person.gif');
 
      it('should redirect to /home', function (done) {
        agent
        .post('/coachsignup')
        .field('email', 'test2@mail.com')
        .field('password', '123456')
        .field('game', 'CS:GO')
        .field('nickname', 'jack')
        .field('coachtype', 'Online')
        .field('cost', '20')
        .attach('photo',newPath)
        .expect('Location','/home')
        .end(done)
      })
  });     
  after(function(done) {
      User.findOne({"local.email" : 'test2@mail.com'}).exec(function(err, user){
         var oldPath = path.join(__dirname, '../public', user.local.photo);
          fs.unlinkSync(oldPath);
          user.remove();
            return done();
      });
 
  
    
    });
})

//Coach sign up --Offline
//test signup for no duplicate user, each
//user has to sign up with an unique email
describe('Coach', function () {
  before(function(done) {
    return done();
    });
  
  describe('Offline Coach Sign up test', function () {
    var newPath =  path.join(__dirname+'/person.gif');
 
      it('should redirect to /home', function (done) {
        agent
        .post('/coachsignup')
        .field('email', 'test3@mail.com')
        .field('password', '123456')
        .field('game', 'CS:GO')
        .field('nickname', 'jack')
        .field('coachtype', 'Offline')
        .field('streetAddress', '169p Finch Avenu E')
        .field('city', 'North York'  )
        .field('province', 'Ontario' )
        .field('cost', '20')
        .attach('photo',newPath)
        .expect('Location','/home')
        .end(done)
      })
  });     
  after(function(done) {
      User.findOne({"local.email" : 'test3@mail.com'}).exec(function(err, user){
            var oldPath = path.join(__dirname, '../public', user.local.photo);
          fs.unlinkSync(oldPath);
          user.remove();
           return done();
        });
     
    });
})





// =====================================
// Log in===============================
// =====================================
//test login in
describe('User', function () { 
  before(function(done) {
      var user  = new User();
      user.local.email ="test@mail.com";
      user.local.password = user.generateHash("123456");
      user.save(done);
    });
  
  describe('Login test', function () {
      it('should redirect to /home', function (done) {
        agent
        .post('/login')
        .field('email', 'test@mail.com')
        .field('password', '123456')
        .expect('Location','/home')
        .end(done)
      })
  });
      
  after(function(done) {
      User.remove({"local.email" : 'test@mail.com'}, function(){
          return done();
        })
       
                                                        
    });
});
  



// =====================================
// Game pages ==========================
// =====================================
describe('Gamepage', function(){
  describe('Routing: Enter Gamepage', function(){
    it("should link to gamepage", function(done){
      agent
        .get('/games/lol')
        .expect(200)
        .end(done)
      });
    });
});






// =====================================
// SEARCH COACHES ======================
// =====================================	   
// process the search form
describe('Search', function(){
  describe('Search for coaches', function(){
    it("should redirect to gamepage/csgo ", function(done){
      agent
        .post('/search')
        .field('gamename', 'CS:GO')
        .field('cost', 'Free')
        .field('coachtype', 'Online')
        .expect(200)
        .end(done)
      });
    });
});
  


// =====================================
// PROFILE SECTION =====================
// =====================================

//Test security for perosnal file
//each user can not access other users' profile
describe('UserProfile', function () { 
  before(function(done) {
      var user  = new User();
      user.local.email ="userprofiletest@mail.com";
      user.local.password = user.generateHash("123456");
      user.save(done);
	
    });
  
  describe('Profle Security test', function () {
      it('should redirect to /', function (done) {
        agent
        .get('/profile')
        .expect('Location', '/')
        .expect(302)
        .end(done)
      })
  });
      
  after(function(done) {
      User.remove({"local.email" : 'userprofiletest@mail.com'}, function(){
         return done();
        
        });

    });
});


//User is login the can access his profile
describe('UserProfile', function () { 
  before(function(done) {
      var user  = new User();
      user.local.email ="userprofiletest2@mail.com";
      user.local.password = user.generateHash("123456");
      user.save();
      agent
        .post('/login')
        .field('email', 'userprofiletest2@mail.com')
        .field('password', '123456')
        .expect('Location','/home')
        .end(done)   
    });
  
  describe('Login in - Profile ', function () {
      it('should redirect to /profile', function (done) {
        agent
        .get('/profile')
        .expect(200)
        .end(done)
      })
  });
  
  after(function(done) {
      User.remove({"local.email" : 'userprofiletest2@mail.com'}, function(err){
         return done();
        });
     
    });
});




// =====================================
// View coach ==========================
// =====================================
describe('View coach infomation', function () { 
  before(function(done) {
      //create as student and login in
      var user  = new User();
      user.local.email ="testviewcoachprofile@mail.com";
      user.local.password = user.generateHash("123456");
      user.save();
      //create a coach
      var coach = new User();
      coach.local.email = "testviewcoachprofile-coach@mail.com"
      coach.local.password = coach.generateHash("123456");
      coach.local.occupation = "coach"
      coach.local.game = "CS:GO"
      coach.local.coachtype = "Online"
      coach.save();
      agent
        .post('/login')
        .field('email', 'testviewcoachprofile@mail.com')
        .field('password', '123456')
        .expect('Location', '/home')
        .end(done)   
    });
  
  
  describe('View coach', function () {
      it('should link to /users/user_id', function (done) {
        User.findOne({"local.email": "testviewcoachprofile-coach@mail.com"}).exec(function(err, coach){
         var url ='/users/' + coach._id
         agent
        .get(url)
        .expect(200)
        .end(done)  
          });
    
      })
  });
  
  after(function(done) {
      User.remove({"local.email" : 'testviewcoachprofile@mail.com'},function(err){
          User.remove({"local.email": "testviewcoachprofile-coach@mail.com"}).exec();
           return done();
            
        });

     
    });
});




// =====================================
// Send Message ========================
// =====================================
describe('Send Message', function () {
  
  before(function(done) {
      //create as student and login in
      var user  = new User();
      var id = 
      user.local.email ="testsendmessage@mail.com";
      user.local.password = user.generateHash("123456");
      user.save();
      //create a coach
      var coach = new User();
      coach.local.email = "testsendmessage-coach@mail.com"
      coach.local.password = coach.generateHash("123456");
      coach.local.occupation = "coach"
      coach.local.game = "CS:GO"
      coach.local.coachtype = "Online"
      coach.save();
      agent
        .post('/login')
        .field('email', 'testsendmessage@mail.com')
        .field('password', '123456')
        .expect('Location', '/home')
        .end(done)
        
    });
  
  describe('Send hello to a coach', function () {
      it('send request /messages/user_id', function (done) {
        User.findOne({"local.email": "testsendmessage-coach@mail.com"}).exec(function(err, coach){
         var url ='/message/' + coach._id
         agent
        .post(url)
        .field('content',"hello")
        .expect(302)
        .end(done)  
          });
    
      })
  });
  
  after(function(done) {
      User.remove({"local.email" : 'testsendmessage@mail.com'}).exec(function(){
              User.remove({"local.email": "testsendmessage-coach@mail.com"}, function(err){
                Message.remove().exec(function(err){
                   return done();
                })
                });  
        });
    });
});




// =====================================
// Comment and rate ====================
// =====================================
describe('Comment and Rate', function () {
  
  before(function(done) {
      //create as student and login in
      var user  = new User();
      var id = 
      user.local.email ="testcomment@mail.com";
      user.local.password = user.generateHash("123456");
      user.save();
      //create a coach
      var coach = new User();
      coach.local.email = "testcomment-coach@mail.com"
      coach.local.password = coach.generateHash("123456");
      coach.local.occupation = "coach"
      coach.local.game = "CS:GO"
      coach.local.coachtype = "Online"
      coach.save();
      agent
        .post('/login')
        .field('email', 'testcomment@mail.com')
        .field('password', '123456')
        .expect('Location', '/home')
        .end(done)
        
    });
  
  describe('Send a comment to a coach', function () {
      it('send request /comments/user_id', function (done) {
        User.findOne({"local.email": "testcomment-coach@mail.com"}).exec(function(err, coach){
         var url ='/comments/' + coach._id
         agent
        .post(url)
        .field('comment',"good coach")
        .field('rate',  10)
        .expect(302)
        .end(done)  
         });
      })
  });
  
  
  after(function(done) {
      User.remove({"local.email" : 'testcomment@mail.com'}).exec(function(){
              User.remove({"local.email": "testcomment-coach@mail.com"}, function(err){
               Comment.remove().exec(function(err){
                  return done();
               })
              });  
        });
     
    });
});

