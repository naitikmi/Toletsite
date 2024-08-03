const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    let Listingdata =await Listing.find();
    res.render("listings/index.ejs",{Listingdata});
};

module.exports.renderNew = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showlisting = async (req,res)=>{
    let {id} = req.params;
    let showlistdata = await Listing.findById(id)
    .populate({path : "reviews",populate :{path:"author",},})
    .populate("owner");
    if(!showlistdata){
        req.flash("error","Listing you requested for doesn't exist.");
        res.redirect("/listings");
    }
    console.log(showlistdata);
    res.render("listings/show.ejs",{showlistdata});
};

module.exports.createlisting = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newListings = new Listing(req.body.listing);
    newListings.owner = req.user._id;
    // console.log(req.user);
    newListings.image = {url,filename};
    await newListings.save();
    req.flash("success","new listing added");
    res.redirect("/listings");
};

module.exports.editlisting = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for doesn't exist.");
        res.redirect("/listings");
    }
    let originalimgurl = listing.image.url;
    let neworiginalimgurl = originalimgurl.replace("/upload","/upload/h_250,w_250");
    req.flash("success","listing edit successfully");
    res.render("listings/edit.ejs",{listing,neworiginalimgurl});
};

module.exports.updatelisting = async (req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
   
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted successfully");
    res.redirect("/listings");
};