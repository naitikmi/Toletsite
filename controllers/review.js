const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.reviewpostroute = async(req,res)=>{
    console.log(req.params.id);
    let listing =await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    listing.reviews.push(newreview);
    // console.log(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success","new review created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.reviewdeleteroute = async(req,res)=>{
    let {id , reviewid} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("success","review deleted successfully");
    res.redirect(`/listings/${id}`);
};