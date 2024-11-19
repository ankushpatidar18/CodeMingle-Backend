const mongoose = require("mongoose");
const npm_validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//1.creating user attributes
//2.adding validation

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 1,
        maxLength : 20,
    },
    lastName : {
        type : String,
        minLength : 1,
        maxLength : 20,
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim :true,
        immutable:true,
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
                throw new Error("Password should be strong")
            }
        }
    },
    age : {
        type : Number,
        min : 12,
        max : 100,
        immutable:true,
    },
    gender : {
        type : String,
        immutable:true,
        enum : ["male","female","other"], 
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
        minLength:1,
        maxLength : 50,
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

//creating a helper method for validating password
userSchema.methods.validatePassword = async function (password){
    const dbPassword = this.password;
    const isPasswordValid = await bcrypt.compare(password, dbPassword);
    return isPasswordValid;

}

//creating a helper method for user to generate jwt token
userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id : user._id},"CODE@Mingle$$",{expiresIn : "7d"})
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

