var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now       //()
    }
});
/*

ItemSchema.methods.encryptPassword = function(password){
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

ItemSchema.virtual('password')
    .set(function(password) {
        this._plainpassword = password;
        this.salt = Math.round(new Date().valueOf() * Math.random()) + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainpassword; });

ItemSchema.methods.checkPassword = function() {
    return this.encryptPassword(password) === this.hashedPassword;
};
*/

module.exports = mongoose.model('Item', ItemSchema);