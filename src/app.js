// starting point of project //

//install express

//requiring database so that first db connect then server listen
const connectDB = require("./config/database")

//creating webserver through express.js
const express = require("express");
const app = express();

connectDB().then(()=>{
    console.log("database connected")
    app.listen(3000,()=>{
        console.log('server is listening on port number 3000')
    });
 }).catch((err)=> console.log(err))


