const express = require("express");

const profileRouter = express.Router();

const {userAuth} = require("../middlewares/auth")
const validation = require("../utils/validation")
const bcrypt = require("bcrypt")

//for user profile after login

profileRouter.get("/profile/view",userAuth,async (req,res)=>{
    try{
    const user =req.user;
    return res.send(user);
    }catch(err){
      return res.status(400).send("ERR" + err.message);
    }
  });

profileRouter.post("/profile/edit",userAuth,async (req,res)=>{
  //Work to do here,have to add validation on every field
  try{
    const user = req.user;
    const NOT_ALLOWED_UPDATES = ["emailId","password","gender"];
    const key_arr = Object.keys(req.body);
   //to do : know which field is not valid
    const isNotValid = NOT_ALLOWED_UPDATES.some((ele)=> key_arr.includes(ele));
    if(isNotValid){
      return res.status(400).json({message : "Can't update this thing"})
    }

    key_arr.forEach((ele)=> user[ele] = req.body[ele])
    

    const updatedUser = await user.save();
    
    return res.json({message : "updated successfully", data : updatedUser});
  }catch(err){
    return res.status(400).json({message : err.message})
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user; // Assume this contains the user fetched by `userAuth` middleware
    const { currentPassword, newPassword } = req.body;

    // Check if current password is provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    // Verify the current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Validate the new password strength
    try {
      validation(newPassword);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;

    // Save the updated user
    const updatedUser = await user.save();
    return res.json({ message: "Password changed successfully", data: updatedUser });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;