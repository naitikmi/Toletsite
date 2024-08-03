const User = require("../models/user");

module.exports.signupgetroute = async(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signuppostroute = async (req,res)=>{
    try{
        let { username , email , password}=req.body;
        const newuser = new User({email,username});
        const registeruser = await User.register(newuser,password);
        // console.log(registeruser);
        req.login(registeruser,(err)=>{
            if(err){
                return next(err);
            }
                req.flash("success","welcome to toletsite");
                res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    } 
};

module.exports.logingetroute = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.loginpostroute =  async (req,res)=>{
    req.flash("success","welcome back to toletsite!");
 //    res.redirect("/listings");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
 };

module.exports.logoutgetroute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){next(err);}
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })
}