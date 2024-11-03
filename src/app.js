// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database");

//for process.env to secure cluster uri
require("dotenv").config();

const User = require("./models/user");

//creating webserver through express.js
const express = require("express");
const app = express();

//middleware for read the json and convert into javascript object
app.use(express.json());

app.patch("/user", async (req, res) => {
    try {
      const NOT_ALLOWED_UPDATES = [
        "emailId",
        "firstName",
        "lastName",
        "password",
        "age",
        "gender",
      ];
      const keys_arr = Object.keys(req.body);
      const not_allowed = keys_arr.some((ele) => NOT_ALLOWED_UPDATES.includes(ele));
      const data = req.body;
      const id = req.body.id;
  
      if (!id) {
        return res.status(400).json({ message: "User  ID is required" });
      }
      if (!not_allowed) {
        await User.findByIdAndUpdate(id, data, { runValidators: true });
        return res.status(200).json({ message: "Updated Successfully" });
      } else {
        return res.status(400).json({ message: "These attributes cannot be updated" });
      }
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
  //creating a new instance of model
  const user = new User(req.body);

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
