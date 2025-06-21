const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    urlFor: { type: String, required: true },
    url: { type: String, required: true },
    shortId : {type : String},
    clickCount: { type: Number, default : 0 }
}, {
    timestamps : true
});

module.exports = mongoose.model('User', userschema);