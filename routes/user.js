const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router  = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const usercontroller = require("../controllers/user");

//using router.route() for compacting the code
router.route("/signup").get(usercontroller.signupgetroute).post(usercontroller.signuppostroute);

router.route("/login").get(usercontroller.logingetroute).post(saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login",failureFlash : true,}),usercontroller.loginpostroute);

router.route("/logout").get(usercontroller.logoutgetroute);

module.exports = router;