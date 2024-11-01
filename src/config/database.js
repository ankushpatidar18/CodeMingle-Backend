 //install mongoose

 const mongoose=require("mongoose");

 //connect to cluster
const connectDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI)
 }

 module.exports = connectDB;