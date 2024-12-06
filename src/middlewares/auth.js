const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
   try {
      const cookies = req.cookies;
      const { token } = cookies;

      if (!token) {
         return res.status(401).json({ message: "Please Login!" });
      }

      const decodedObj = await jwt.verify(token, "CODE@Mingle$$")
      const { _id } = decodedObj;

      // Explicitly select the password field(select false in user schema)
      const user = await User.findById(_id).select('+password');

      if (!user) {
         return res.status(401).json({ message: "User Not Found" });
      }

      // Attach user to the request
      req.user = user;
      next();
   } catch (err) {
      
      return res.status(401).json({ message: "Please Login!" });
   }
}

module.exports = { userAuth }