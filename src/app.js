// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database")

//for process.env to secure cluster uri
require('dotenv').config();

const User = require("./models/user")


//creating webserver through express.js
const express = require("express");
const app = express();

//middleware for read the json and convert into javascript object
app.use(express.json())


app.patch("/user",async (req,res)=>{
    const data = req.body;
    const id = req.body.id;
    try{
          await User.findByIdAndUpdate(id,data,{ runValidators : true })
          res.send("Updated Successfully")
    }catch(err){
        res.send("problem in updating" + err.message)
    }
})

app.delete("/user",async (req,res)=>{
    const userId = req.body.id;
    try{
          await User.findByIdAndDelete(userId)
          res.send("Deleted Successfully")
    }catch(err){
          res.status(400).send("something went wrong");
    }
})


//middleware for getting all the user data
app.get("/feed",async (req,res)=>{
    
   try{
    const users = await User.find();
    if(users.length===0)
    {
        res.status(400).send("No Registered User");
    }
    else{
        res.send(users);
    }
    
   }catch(err){
    res.status(400).send("something went wrong");
   }
})



//middleware for adding user
app.post("/signup",async (req,res)=>{
   
    //creating a new instance of model
     const user = new User(req.body)
     
     try{
     //returns a promise
     await user.save();
     res.send("User created successfully")
     }catch(err) {
         res.status(400).send("User is not Created because of ",err.message)
     }
   
})


connectDB().then(()=>{
    console.log("database connected")
    app.listen(3000,()=>{
        console.log('server is listening on port number 3000')
    });
 }).catch((err)=> console.log(err))


