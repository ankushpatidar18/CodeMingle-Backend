const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const userRouter = express.Router();

const USER_SAFE_DATA_FOR_REQUEST = "fullName photoUrl skills experienceLevel lookingFor about"
const USER_SAFE_DATA_FOR_FEED = "fullName photoUrl skills experienceLevel lookingFor about leetCodeProfile githubProfile"
userRouter.get("/user/request/received",userAuth,async (req,res)=>{
    try{
        const loggedinId = req.user._id;
        const receivedRequests = await ConnectionRequestModel.find(
            {toUserId : loggedinId,
            status : "interested"}
        ).populate("fromUserId",USER_SAFE_DATA_FOR_REQUEST)
        return res.status(200).json({data : receivedRequests});
    }catch(err){
        return res.status(400).json({message : "ERR" + err.message})
    }
})

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedinId = req.user._id;
        const connections = await ConnectionRequestModel.find(
            { $or : [ {toUserId : loggedinId,status : "accepted"},
                {fromUserId : loggedinId,status : "accepted"}]}
            
        ).populate("fromUserId",USER_SAFE_DATA_FOR_REQUEST).populate("toUserId",USER_SAFE_DATA_FOR_REQUEST);

        const data = connections.map((connection) => {
            if(connection.fromUserId._id.toString() === loggedinId.toString()){
                return connection.toUserId;
            }
            return connection.fromUserId;
            
        });
        return res.json({data : data});
    }catch(err){
        return res.status(400).json({message : "ERR" + err.message});
    }
})

userRouter.get("/user/feed",userAuth,async (req,res)=>{
    //to do : filter user from skills ,gender etc
    try{
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const loggedinUser = req.user;

        const connections = await ConnectionRequestModel.find({
             $or : [
                {fromUserId : loggedinUser._id},
                {toUserId : loggedinUser._id}]
        }
            ).select("fromUserId toUserId")

    const hideUsers = new Set();

    connections.forEach((ele)=>{
        hideUsers.add(ele.toUserId.toString());
        hideUsers.add(ele.fromUserId.toString());
    })

    const users = await User.find({
        $and : [
            {_id : { $nin : Array.from(hideUsers)}},
            {_id : {$ne : loggedinUser._id}}
        ]
    }).select(USER_SAFE_DATA_FOR_FEED).skip(skip).limit(limit);

    return res.json({data : users});


    }catch(err){
        return res.status(400).json({message : "ERR" + err.message});
    }
})

module.exports = userRouter;