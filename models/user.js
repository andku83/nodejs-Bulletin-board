var mongoose = require('mongoose'),
    crypto = require('crypto');
var autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    name: {
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
        default: Date.now       //()
    }
});

UserSchema.plugin(autoIncrement.plugin, {
    model: 'UserSchema',
    field: 'id',
    startAt: 1
});

//var User = connection.model('User', UserSchema);

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

UserSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);