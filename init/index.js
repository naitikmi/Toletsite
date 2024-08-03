const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

main().then(() =>{
    console.log("success connection");
  }).catch(err=>{
      console.log(err);
  })
  
async function main(){
      await mongoose.connect('mongodb://localhost:27017/toletsite');
  }


const initDb = async () =>{
     await Listing.deleteMany({});
     initdata.data = initdata.data.map((obj)=>({
      ...obj,
      owner : "668774c7c138f824070defb2",
     }));
     await Listing.insertMany(initdata.data);
     console.log("data added");
}

initDb();