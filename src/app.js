// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database");

const jwt = require("jsonwebtoken");
const cors = require('cors');




//for process.env to secure cluster uri
require("dotenv").config();

const User = require("./models/user");

//creating webserver through express.js
const express = require("express");
const app = express();

// Enable cross-origin requests
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


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
    app.listen(8080, () => {
      console.log("server is listening on port number 8080");
    });
  })
  .catch((err) => console.log(err));
