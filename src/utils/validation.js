const npm_validator = require("validator");
const validation = (password) => {
  if (!npm_validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};

module.exports = validation;
