const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/Expresserror.js");



module.exports.validatelistingschema =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);   
    }else{
        next();
    }
}


module.exports.validatereviewschema =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(msg,400);   
    }else{
        next();
    }
}


module,exports.isloggedin  = (req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.user){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isreviewAuthor = async (req,res,next) =>{
    let {id , reviewid }=req.params;
    let review = await Review.findById(reviewid);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}