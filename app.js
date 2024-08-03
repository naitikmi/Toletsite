
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app  = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/Expresserror.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;

const User = require("./models/user.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const user = require("./models/user.js");


app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

const dburl = process.env.ALTAS_DB_URL;

main().then(() =>{
    console.log("success connection");
  }).catch(err=>{
      console.log(err);
  })
  
async function main(){
      await mongoose.connect(dburl);
  }


const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret :process.env.SECRET_STRING,
    },
    touchAfter : 24*60*60,
})

store.on("error",()=>{
    console.log("Error in mongo session",err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET_STRING,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge :  7*24*60*60*1000,
        httpOnly : true,
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use("/",userRoutes);

app.all("*",(req,res,next)=>{
    next(new ExpressError("Page not found",404));
})

//error handler middleware
app.use((err,req,res,next)=>{
    let {status= 500, message = "some error occured"} = err;
    res.status(status).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("port is listening on 8080");
})
  
