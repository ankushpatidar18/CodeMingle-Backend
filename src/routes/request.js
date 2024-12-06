const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isToUser = await User.findById(toUserId).exec();
        if (!isToUser) {
            return res.status(404).json({ message: "User not found" });
    
        }

        // Status validation
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Check for existing request from the current user to the target user
        const existingRequest = await ConnectionRequestModel.findOne({
            $or : [
            {fromUserId,toUserId},
            {fromUserId :toUserId,toUserId : fromUserId}
            ]
        });

        if (existingRequest) {
            // If request already exists from this user to target user, prevent duplicate
            return res.status(400).json({ message: "Request already sent" });
        }

        // Create new connection request
        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        const savedRequest= await connectionRequest.save();

        return res.status(200).json({ 
            message: "Request sent successfully", 
            data: savedRequest 
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req,res)=>{
    try{
        const validStatus = ["accepted", "rejected"];
        const status = req.params.status;
        if(!validStatus.includes(status)){
            return res.status(400).json({message: "Invalid status"});
        }
        const fromUserId = req.params.requestId;
        const toUserId = req.user._id;

        const isConnection = await ConnectionRequestModel.findOne({fromUserId,toUserId,status : "interested"});
        if(!isConnection){
            return res.status(400).json({message: "Invalid connection"});
        }

        isConnection.status = status;
        const data = await isConnection.save();
        return res.status(200).json({message: "Connection updated successfully",data:data});


    }catch(err){
       return res.status(400).json({message : "Invalid request" });
    }
})

module.exports = requestRouter;