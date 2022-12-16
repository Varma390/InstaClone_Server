const mongoose = require("mongoose");
const date = require('date-and-time');

const now = new Date();
const pattern = date.compile('ddd, MMM DD YYYY');

const postSchema = new mongoose.Schema({
    name:{ type: String } ,
    location: { type: String } ,
    description: { type: String } ,
    PostImage:
    {
        data: Buffer,
        contentType: String
    },
    // date: { type: Date, default: moment().format("MMM Do YYYY") }
    date: { type: Date, default: date.format(now, pattern)   }


})


const PostModel = mongoose.model('posts',postSchema);
PostModel.createCollection();

module.exports = PostModel;