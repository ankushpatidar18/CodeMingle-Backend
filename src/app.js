// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database");

const jwt = require("jsonwebtoken");



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

const authRouter = require("./routes/auth");
const profileRouter =  require("./routes/profile");
const requestRouter =  require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);











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



connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is listening on port number 3000");
    });
  })
  .catch((err) => console.log(err));
