var mongoose = require('mongoose'),
    crypto = require('crypto');


var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

UserSchema.virtual('password')
    .set(function(password) {
        this._plainpassword = password;
        this.salt = Math.round(new Date().valueOf() * Math.random()) + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainpassword; });

UserSchema.methods.checkPassword = function() {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);