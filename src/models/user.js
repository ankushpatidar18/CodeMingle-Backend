const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 20,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      immutable: true,
      validate: {
        validator: validator.isEmail,
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      select: false,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."
          );
        }
      },
    },
    age: {
      type: Number,
      min: 12,
      max: 100,
    },
    gender: {
      type: String,
      required : true,
      enum: ["male", "female", "other"],
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiibOngFYog5Ri5UoFKH3CsHMOvomBLf4JAw&s",
      validate(value) {
        if (!validator.isURL(value, { protocols: ["http", "https", "ftp"] })) {
          throw new Error("PhotoUrl should be a valid URL.");
        }
      },
    },
    about: {
      type: String,
      minLength: 1,
      maxLength: 50,
      default: "Write about yourself here(in 50 words)!",
    },
    skills: {
      type: [String],
      required : true,
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "Too many skills! Maximum allowed is 10.",
      },
    },
    experienceLevel: {
      type: String,
      required : true,
      enum: ["Beginner", "Intermediate", "Expert"],
    },
    lookingFor: {
      type: String,
      maxLength: 20,
      default: "Looking for.....",
    },
    leetCodeProfile: {
      type: String,
      validate: {
        validator: function (url) {
          return /^(https?:\/\/)?(www\.)?leetcode\.com\/[a-zA-Z0-9-]+\/?$/.test(
            url
          );
        },
        message: "Please enter a valid LeetCode profile URL.",
      },
    },
    githubProfile: {
      type: String,
      validate: {
        validator: function (url) {
          return /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/.test(
            url
          );
        },
        message: "Please enter a valid GitHub profile URL.",
      },
    },
  },
  { timestamps: true }
);

// // Pre-save hook for hashing password
// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// Helper method to validate password
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Helper method to generate JWT token
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
