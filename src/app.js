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
const userRouter = require("./routes/userRoute");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("server is listening on port number 3000");
    });
  })
  .catch((err) => console.log(err));
