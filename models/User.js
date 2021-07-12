const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First name must be more then 3 characters"],
        maxLength: [99, "This is too much man.... Chillll..."],
      
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last name must be more then 3 characters"],
        maxLength: [99, "This is too much man.... Chillll..."]
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: [3, "Your password is too weak... Khalaaas"],
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],

},

{
    timestamps: true // means createdAt and updatedAt
});


// VerifyPassword
userSchema.methods.verifyPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}


const User = mongoose.model("User", userSchema);

module.exports = User;