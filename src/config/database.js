const mongoose=require("mongoose");

 //connect to cluster
const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URL)
 }

 module.exports = connectDB;