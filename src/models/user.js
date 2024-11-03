const mongoose = require("mongoose");

//1.creating user attributes
//2.adding validation

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,

    },
    lastName : {
        type : String,
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim :true
    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        min : 12,
    },
    gender : {
        type : String,
        validate(value){
            if(!["male","female","other"].includes(value))
            {
                throw new Error("gender is not valid");
            }
        }
    },
    photoUrl : {
        type : String,
        default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiibOngFYog5Ri5UoFKH3CsHMOvomBLf4JAw&s',
    },
    about : {
        type : String,
        default : "Write about yourself here!"
    },
    skills : {
        type : [String]
    }
},{timestamps : true})

const User = mongoose.model('User', userSchema);

module.exports = User;

