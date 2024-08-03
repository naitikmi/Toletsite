const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router  = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validatereviewschema,isloggedin,isreviewAuthor} = require("../middleware.js");

const reviewcontroller = require("../controllers/review.js");

//review post route
router.post("/",isloggedin,validatereviewschema,wrapAsync(reviewcontroller.reviewpostroute));

//delete review route
router.delete("/:reviewid",isloggedin,isreviewAuthor,wrapAsync(reviewcontroller.reviewdeleteroute));

module.exports = router;