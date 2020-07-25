const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    pic : {
        type : String,
        default: "https://res.cloudinary.com/deepzcloud/image/upload/v1595567865/noimage_tgwkl3.jpg"
    },
    followers: [{ type: ObjectId, ref: "user" }],
    following: [{ type: ObjectId, ref: "user" }]

})


module.exports = mongoose.model('user', userSchema);