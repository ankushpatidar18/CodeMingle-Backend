const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req,res,next) =>{
   try{
    const cookies = req.cookies;
   const {token}=cookies;

   if(!token){
    throw new Error("token is not valid");
   }

   const decodedObj = await jwt.verify(token,"CODE@Mingle$$")
   const {_id}= decodedObj;

   const user = await User.findById(_id)

   if(!user){
    throw new Error("User not found")
   }
   //attaching user to next request
   req.user=user;
   next();
   }catch(err){
    res.status(400).send("ERR " + err.message);
   }

}

module.exports = {userAuth}