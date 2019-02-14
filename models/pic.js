const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pic = new Schema({
    picname: String,
    image: String,
    description: String, //可随意添加字段
    price: Number,
    date: Date
});

module.exports = mongoose.model('Pic', Pic)