
Command to run unit test:

        1. npm install (install all modules needed at root)
        2. npm test (in test dir)


Documentation:

We used mocha as our testing framework to test our project. We installed supertest and should module.
The reason we choose Mocha is flexible and semantic
Bascially, we used 11 test cases to make sure our application run properly.

1. Homepage: we test the route '/' to homepage, it should expect a 200 Ok status code.

2. Gamepage: test routes to specific game

2. Sign up : This part we used three cases for students, Offline coaches and Online coaches separately.
We focus on the testing basic information passed from form to server. Especially, we want to test successful
uploading of photo for each user. For Off-line coach Sign up, we also test the address of coaches whether can
be transalated as latitute and longitude which will be used for google map

3.Login: We used passport module for authentication in order gurantee only user himself can access his personal
profile. The test purpose is TO check whether our implementation can protect user profile.

4.View user public infomation: we used case called 'View coach infomation' in order to check that coach' information
can be successfully showed on the front end and also the proper routes for view coach

5.Send Messages: we used a test case to check a user can receive the meassge sent from the other user

6.Comment and rate: when a student leave a comments for a coach, others can see the public comments and each student
can rate his coach once.


Test result:
  Homepage
    Routing: Enter Homepage
GET / 200 34ms - 2kb
      ✓ should provide a view name (56ms)

  Student
    Student Sign up test
POST /studentsignup 302 108ms - 27b
      ✓ should redirect to /home (126ms)

  Coach
    Online Coach Sign up test
POST /coachsignup 302 94ms - 27b
      ✓ should redirect to /home (98ms)

  Coach
    Offline Coach Sign up test
POST /coachsignup 302 460ms - 27b
      ✓ should redirect to /home (471ms)

  User
    Login test
POST /login 302 62ms - 27b
      ✓ should redirect to /home (66ms)

  Gamepage
    Routing: Enter Gamepage

GET /games/lol 200 11ms - 2.66kb
      ✓ should link to gamepage

  Search
    Search for coaches

POST /search 200 9ms - 2.73kb
      ✓ should redirect to gamepage/csgo 

  UserProfile
    Profle Security test
GET /profile 302 1ms - 23b
      ✓ should redirect to /

  View coach infomation
POST /login 302 62ms - 27b
    View coach
GET /users/57991290ed778493059fb108 200 9ms - 3.19kb
      ✓ should link to /users/user_id

  Send Message
POST /login 302 65ms - 27b
    Send hello to a coach
POST /message/57991291ed778493059fb10a 302 11ms - 53b
      ✓ send request /messages/user_id

  Comment and Rate
POST /login 302 58ms - 27b
    Send a comment to a coach
POST /comments/57991291ed778493059fb10d 302 9ms - 53b
      ✓ send request /comments/user_id
      
  11 passing (2s)






    
    
 
