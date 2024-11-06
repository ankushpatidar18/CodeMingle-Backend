// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database");

const jwt = require("jsonwebtoken");
const {userAuth}= require("./middlewares/auth")

//for encrypting password
const bcrypt = require("bcrypt")

//for process.env to secure cluster uri
require("dotenv").config();

const User = require("./models/user");

//creating webserver through express.js
const express = require("express");
const app = express();

//middleware for read the json and convert into javascript object
app.use(express.json());

//for parsing the cookie
const cookieParser = require("cookie-parser")
app.use(cookieParser())

//for user profile after login

app.get("/profile",userAuth,async (req,res)=>{
  try{
  const user =req.user;
  res.send(user);
  }catch(err){
    res.status(400).send("ERR" + err.message);
  }
})





//for user login
app.post("/login",async (req,res)=>{
 try{
  const {emailId,password} = req.body;
  const user = await User.findOne({emailId : emailId});
 
  if(user){
    const validateUser = await user.validatePassword(password)
    if(validateUser){
      //create a jwt token
      const token = await user.getJWT();


      //add the token to cookie and send back to user
      res.cookie("token",token,{expires :new Date(Date.now() + 8*3600000)})



      res.status(200).json("User is valid")
     }else{
      throw new Error("invalid credentials")
     }
  }else{
    throw new Error("invalid credentials")

  }
 }catch(err){
  res.status(400).send("ERROR" + err.message)
 }

})




//for updating user detail
app.patch("/user", async (req, res) => {
  try {
    const NOT_ALLOWED_UPDATES = ["emailId","age", "gender"];
    const keysArr = Object.keys(req.body);
    const notAllowed = keysArr.filter((key) => NOT_ALLOWED_UPDATES.includes(key));

    const id = req.body.id;
    const data = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (notAllowed.length > 0) {
      return res.status(400).json({ message: `These attributes cannot be updated: ${notAllowed.join(", ")}` });
    }

    await User.findByIdAndUpdate(id, data, { runValidators: true });
    return res.status(200).json({ message: "Updated Successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Problem in updating: " + err.message });
  }
});

  
  app.delete("/user", async (req, res) => {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ message: "User  ID is required" });
    }
    
    try {
      const deletedUser  = await User.findByIdAndDelete(userId);
      if (!deletedUser ) {
        return res.status(404).json({ message: "User  not found" });
      }
      res.json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting user: " + err.message });
    }
  });
//middleware for getting all the user data
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(400).send("No Registered User");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//middleware for adding user
app.post("/signup", async (req, res) => {
  const {emailId,firstName,lastName,password,age,gender,skills}= req.body;
  //validation of data(done in schema)

  //encrypt the password(npm bcrypt)
  const passwordHash = await bcrypt.hash(password,10);
  



  //creating a new instance of model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password : passwordHash,
    age,
    gender,
    skills
  });

  try {
    //returns a promise
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("User is not Created because of " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is listening on port number 3000");
    });
  })
  .catch((err) => console.log(err));
