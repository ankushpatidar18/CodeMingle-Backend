const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'From User ID is required']
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'To User ID is required']
    },
    status: {
        type: String,
        enum: ["ignored", "interested", "accepted", "rejected"],
        required: [true, 'Status is required']
    }
}, { timestamps: true });

//
connectionRequestSchema.index({fromUserId:1,toUserId :1});

//calling before saving new connection request
connectionRequestSchema.pre('save', function(next) {
    if(this.toUserId.equals(this.fromUserId))
        throw new Error('Cannot send connection request to yourself');
    next();
  });

const ConnectionRequestModel = mongoose.model('ConnectionRequestModel', connectionRequestSchema);
module.exports = ConnectionRequestModel;