// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        nickname     : String,
        address      : {
            street   : String,
            city     : String,
            province : String,
        },
        coordinate   : {
            lng: String,
            lat: String
        },
        occupation   : String,
        game         : String,
        rate         : {
            grade: Number,
            list: [Number],
            studentlist: [String]
        },
        cost         : Number,
        coachtype    : String,
        photo        : String,
        follow       : [String],
        schedule      : {
            "_10_11": {type: [String], default: [0,0,0,0,0,0,0]},
            "_11_12": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_12_13": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_13_14": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_14_15": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_15_16": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_16_17": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_17_18": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_18_19": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_19_20": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_20_21": {type: [String], default: [0,0,0,0,0,0,0]}, 
            "_21_22": {type: [String], default: [0,0,0,0,0,0,0]}, 
           "_22_23": {type: [String], default: [0,0,0,0,0,0,0]},
            "_23_00": {type: [String], default: [0,0,0,0,0,0,0]}  
        },
        pocket: {type:Number, default: 10000},
        recent_orders :[String]
    },
    
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
