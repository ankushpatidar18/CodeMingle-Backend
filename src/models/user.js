const mongoose = require("mongoose");
const npm_validator = require("validator")

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
        trim :true,
        validate: {
            //you can also use npm validator
            validator: function (value) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value); // Simple regex for email format
            },
            message: props => `${props.value} is not a valid email!`
          }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!npm_validator.isStrongPassword(value)){
                throw  new Error("Password should be strong")
            }
        }
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
        validate(value){
            if(!npm_validator.isURL(value,{ protocols: ['http','https','ftp'] }))
            {
                throw new Error("PhotoUrl should be a valid url")
            }
        }
    },
    about : {
        type : String,
        default : "Write about yourself here!"
    },
    skills: {
        type: [String],
        validate: {
            validator: function(value) {
                return value.length <= 20;
            },
            message: 'Too many skills! Maximum allowed is 20.'
        }
    }

},{timestamps : true})

const User = mongoose.model('User', userSchema);

module.exports = User;

