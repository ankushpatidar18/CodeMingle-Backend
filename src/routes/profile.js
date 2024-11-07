const express = require("express");

const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth")
const validation = require("../utils/validation")
const bcrypt = require("bcrypt")

//for user profile after login

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
    const user =req.user;
    res.send(user);
    }catch(err){
      res.status(400).send("ERR" + err.message);
    }
  });

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{
  //Work to do here,have to add validation on every field
  try{
    const user = req.user;
    const NOT_ALLOWED_UPDATES = ["emailId","password"];
    const key_arr = Object.keys(req.body);

    const isNotValid = NOT_ALLOWED_UPDATES.some((ele)=> key_arr.includes(ele));
    if(isNotValid){
      throw new Error("This information can not be updated");
    }
    
    key_arr.forEach((ele)=> user[ele] = req.body[ele])
    await user.save();
    
    res.send("updated successfully");
  }catch(err){
    res.status(400).send("ERR " + err.message)
  }
});

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
  try{
    validation(req.body.password);
    const user = req.user;
    const passwordHash = await bcrypt.hash(req.body.password,10);
    user.password=passwordHash;
    await user.save();
    res.send("password changed successfully");

  }catch(err){
    res.status(400).send("ERR " + err.message);
  }
})

module.exports = profileRouter;