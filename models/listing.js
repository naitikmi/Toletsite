const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description :String,
    image : {
          url : String,
          filename : String,
    },
    price : Number,
    location : String,
    country : String,
    reviews : [
     {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review",
     },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
    }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing.reviews.length>0){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listSchema);
module.exports = Listing;