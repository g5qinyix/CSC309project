// app/models/user.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var commentSchema = mongoose.Schema({
    
    coachid :  String,
    
    comment:  {
        
        studentid: String,
        nickname : String,
        content:  String,
        date:     String
    }
    
});




// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);
