var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var User = require('./user')

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    id: {
        type: Number
    },
    created_at: {
        type: Number,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    user_id: {
        type: Number,
        ref: 'User'
    }
});

ItemSchema.plugin(autoIncrement.plugin, {
    model: 'ItemSchema',
    field: 'id',
    startAt: 1
});

ItemSchema.methods.getInfo = function(userInfo){
    //console.log(this.user)
    return {
        "id": this.id,
        "created_at": Math.floor(this.created_at / 1000),
        "title": this.title,
        "price": this.price,
        "image": this.image,
        "user_id": this.user_id,
        "user": userInfo
    };
};

/*
ItemSchema.methods.getUser = function() {
    User.findOne({id: this.user_id}, function (err, user) {
        if (err) {
            console.log(err);
        } else if (user) {
            console.log(user.getInfo());
            return user;
        } else {
            return "User Not found";
        }
    })
};
*/

module.exports = mongoose.model('Item', ItemSchema);