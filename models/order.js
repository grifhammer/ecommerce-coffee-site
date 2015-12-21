var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Order = new Schema ({
    username: String,
    orderType: {
        pounds: Number,
        frequency: String,
        grind: String
    },
    shippingAddress: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipCode: Number
    },
    deliveryDate: Date,
});

Order.plugin(passportLocalMongoose);

module.exports = mongoose.model('Order', Order);