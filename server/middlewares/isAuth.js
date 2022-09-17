const ApiError = require("../classes/ApiErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader == null || !authHeader.startsWith("Bearer "))
      throw ApiError.Unauthorized("You cannot access this route.");

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (payload == null)
      throw ApiError.Unauthorized("You cannot access this route.");
    const user = await User.findById(payload.userID);

    if (user) {
      const { password, isConfirmed, updatedAt, OTP, __v, ...otherProps } =
        user._doc;
      req.user = otherProps;
      return next();
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = isAuth;
