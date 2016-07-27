var User, app, mongoose, request, server, should, agent;

should   = require("should");
app      = require("../server");
User     = require("../app/models/user");
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
     
        });
      return done();
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
      });
 
  
      return done();
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
        });
      return done();
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
      User.remove({"local.email" : 'test@mail.com'}).exec();
      return done();
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
  
  describe('Profle test', function () {
      it('should redirect to /', function (done) {
        agent
        .get('/profile')
        .expect('Location', '/')
        .expect(302)
        .end(done)
      })
  });
      
  after(function(done) {
      User.remove({"local.email" : 'userprofiletest@mail.com'}).exec();
      return done();
    });
});


describe('UserProfile', function () { 
  before(function(done) {
      var user  = new User();
      user.local.email ="testviewcoachprofile@mail.com";
      user.local.password = user.generateHash("123456");
      user.save();
      agent
        .post('/login')
        .field('email', 'testviewcoachprofile@mail.com')
        .field('password', '123456')
        .expect('Location','/home')
        .end(done)   
    });
  
  describe('Login test', function () {
      it('should redirect to /profile', function (done) {
        agent
        .get('/profile')
        .expect(200)
        .end(done)
      })
  });
      
  after(function(done) {
      User.remove({"local.email" : 'testviewcoachprofiletest@mail.com'}).exec();
      return done();
    });
});
  


