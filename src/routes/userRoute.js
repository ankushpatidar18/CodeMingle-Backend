const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName gender age skills about"

userRouter.get("/user/request/received",userAuth,async (req,res)=>{
    try{
        const loggedinId = req.user._id;
        const receivedRequests = await ConnectionRequestModel.find(
            {toUserId : loggedinId,
            status : "interested"}
        ).populate("fromUserId",USER_SAFE_DATA)
        res.status(200).json({data : receivedRequests});
    }catch(err){
        res.status(400).json({message : "ERR" + err.message})
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedinId = req.user._id;
        const connections = await ConnectionRequestModel.find(
            { $or : [ {toUserId : loggedinId,status : "accepted"},
                {fromUserId : loggedinId,status : "accepted"}]}
            
        ).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);

        const data = connections.map((connection) => {
            if(connection.fromUserId._id.toString() === loggedinId.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
            
        });
        res.json({data : data});
    }catch(err){
        res.status(400).json({message : "ERR" + err.message});
    }
})

module.exports = userRouter;