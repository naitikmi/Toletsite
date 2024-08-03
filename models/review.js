const mongoose = require("mongoose");
const User = require("./user.js");

const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : String,
        min : 1,
        max : 5,
    },
    created_at : {
        type : String,
        default : Date,
    },
    author : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
    }
});

const Review =  mongoose.model("Review",reviewSchema);

module.exports = Review;