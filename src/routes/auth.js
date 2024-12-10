const express = require("express");
const authRouter = express.Router();


//for encrypting password
const bcrypt = require("bcrypt");

const User = require("../models/user");

const validation = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
    
  
    try {
      const {emailId,fullName,password,gender,experienceLevel,skills}= req.body;
    //validation of data(done in schema)
    validation(password);
  
    //encrypt the password(npm bcrypt)
    const passwordHash = await bcrypt.hash(password,10);
    
  
  
  
    //creating a new instance of model
    const user = new User({
      fullName,
      emailId,
      password : passwordHash,
      gender,
      experienceLevel,
      skills
    });
      //returns a promise
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    return res.json({ message: "Sign Up successfully!", data: savedUser });
    } catch (err) {
      return res.status(401).json({message : err.message });
    }
  });

  //for user login
  authRouter.post("/login", async (req, res) => {
    try {
        
        const { emailId, password } = req.body;
        
        // Validate input
        if (!emailId || !password) {
            return res.status(400).json({ 
                message: "Email and password are required" 
            });
        }

        // Find user and explicitly select password for validation
        const user = await User.findOne({ emailId }).select('+password');
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        
        const isValidPassword = await user.validatePassword(password);
        
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }else{
          //create a jwt token
         const token = await user.getJWT();

         //add the token to cookie and send back to user
         res.cookie("token",token,{expires :new Date(Date.now() + 8*3600000)})

         return res.json({message : "Login Successful!",data : user});
        }

         
    } catch(err) {
        console.error(err);
        return res.status(500).json({ message: "Login error" + err.message });
    }
});

//for logout
authRouter.post('/logout', (req, res) => {
  res.cookie("token",null,{
    expires : new Date(Date.now())
  });
  
  return res.status(200).json({ message: "Logged out successfully" });
});

   

module.exports = authRouter;