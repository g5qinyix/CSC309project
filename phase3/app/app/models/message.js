// app/models/user.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var messageSchema = mongoose.Schema({
    
    
    date:     String,
    receiver :{  
        id  : String,
        content  : String,
        status   : Number
    },
    
    sender :{
        id : String,
        content : String,  
    }

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
