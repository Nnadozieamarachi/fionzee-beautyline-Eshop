const mongoose = require('mongoose');

const userSchema = mongoose.Schema
({
    email: {
    type: String,
        required:[true, "please enter your email address"],
    },
    username :{
        type: String,
        required:[true, "please enter your user name"],
    },
    password: {
        type: String,
        required:[true, "please enter password"],
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip :{
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }
}, {
    timestamps:true,
});

userSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals:true,
});

// exports.userSchema = userSchema;
module.exports = mongoose.model("user", userSchema);