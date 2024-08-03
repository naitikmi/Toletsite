
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router  = express.Router();

const Listing = require("../models/listing");
const {isloggedin,isOwner,validatelistingschema} = require("../middleware.js");

const listingcontroller = require("../controllers/listing.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//using router.route()
router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isloggedin,upload.single("listing[image]"),validatelistingschema,wrapAsync(listingcontroller.createlisting));

router.get("/new",isloggedin,listingcontroller.renderNew);


router.route("/:id")
.get(wrapAsync(listingcontroller.showlisting))
.put(isloggedin,isOwner,upload.single("listing[image]"),validatelistingschema,wrapAsync(listingcontroller.updatelisting))
.delete(isloggedin,wrapAsync(listingcontroller.deletelisting));

router.get("/:id/edit",isloggedin,isOwner, wrapAsync(listingcontroller.editlisting));

module.exports = router;
