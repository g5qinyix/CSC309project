Documentation: We used node-load-tester to testing our application performance
We focus on avaerage time of server send data to client when a user login
In order to improve our performance, we firstly tried to improve the performance on
the front end, soe we then deleted some useless css codes to reduce size of css file,
next we used GZIP compress in express with compressed http response. Next we try to
improve performance on the back end, we use mongodb as our database management system,
we redesign our database schema, at first the collections has a list of messages, we
created a new schema for Message which contains the id of sender and receiver. The difference
of between test results is not very very obviously. The average response time in initial test is
always 9, while the improved one is 8 at most time. 


Process:
{
  "baseUrl": "http://localhost:3000",
  "duration": 5000,
  "connections": 1,
  "sequence": [
    { "method": "GET",  "path": "/" },
    { "method": "GET",  "path": "/login", "expect": { "code": 200 } },
    { "method": "POST", "path": "/login", "form": { "email": "1@mail.com" ,"password" : "19941026"} , "expect" : 302 },
    { "method": "GET",  "path": "/signup", "expect": { "code": 200 } },
    { "method": "GET",  "path": "/games/lol", "expect": { "code": 200 }},
    { "method": "GET",  "path": "/profile", "expect": { "code": 200 }},
    { "method": "GET",  "path": "/editstudent" ,"expect": { "code": 200 }},
    { "method": "GET",  "path": "/editcoach" ,"expect": { "code": 200 }}, 
    { "method": "GET",  "path": "/friend" ,"expect": { "code": 200 }},  
    { "method": "GET",  "path": "/messaging", "expect": { "code": 200 }},
    { "method": "GET",  "path": "/logout" ,"expect": { "code": 302 }} 
  ]
}

Initial test: Result:
{
  "paths": {
    "GET /": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 4
    },
    "GET /login": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 4
    },
    "POST /login": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 59
    },
    "GET /signup": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 4
    },
    "GET /games/lol": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 6
    },
    "GET /profile": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 4
    },
    "GET /editstudent": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 4
    },
    "GET /friend": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 5
    },
    "GET /messaging": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 7
    },
    "GET /logout": {
      "pass": 51,
      "fail": 0,
      "total": 51,
      "avgResponseTime": 3
    }
  },
  "errors": {},
  "pass": 510,
  "fail": 0,
  "total": 510,
  "totalTime": 5066,
  "avgResponseTime": 10
}


Improved results:

{
  "paths": {
    "GET /": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 3
    },
    "GET /login": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 3
    },
    "POST /login": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 58
    },
    "GET /signup": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 3
    },
    "GET /games/lol": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 5
    },
    "GET /profile": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 4
    },
    "GET /editstudent": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 3
    },
    "GET /friend": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 4
    },
    "GET /messaging": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 6
    },
    "GET /logout": {
      "pass": 56,
      "fail": 0,
      "total": 56,
      "avgResponseTime": 3
    }
  },
  "errors": {},
  "pass": 560,
  "fail": 0,
  "total": 560,
  "totalTime": 5076,
  "avgResponseTime": 9
}




