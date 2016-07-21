// app/models/user.js
// load the things we need
var mongoose = require('mongoose');


// define the schema for our user model
var messageSchema = mongoose.Schema({
    
    
    receiver :{  
        id  : String,
        content  : String,
        date     : String,
        status   : Number
    },
    
    sender :{
        id : String,
        content : String,
        date : String,    
    }

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
