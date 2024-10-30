// starting point of project //

//creating webserver through express.js
const express = require("express");

const app = express();

app.use("/user",(request,response)=>{
    response.send("hello User,how are you ");
})

app.listen(3000,()=>{
    console.log('server is listening on port number 3000')
});
