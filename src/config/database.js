 //install mongoose

 const mongoose=require("mongoose");

 //connect to cluster
const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://ankushpatidar18:3RKGJoEm1iY3GkFK@learningmongo.u03ac.mongodb.net/')
 }

 module.exports = connectDB;