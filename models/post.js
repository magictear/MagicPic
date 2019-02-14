const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Post = new Schema({
    postimage: String,
    username: String,
    description: String, //可随意添加字段
    classification: String,
    date: Date,
    price: Number,
    postname: String,
    pics: [{
        type: Schema.Types.ObjectId,
        ref: "Pic"
    }]
});

module.exports = mongoose.model('Post', Post)