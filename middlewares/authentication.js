const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const TokenBlackList = require("../models/TokenBlackList");

const auth = async (req, res, next) => {
  const cookie = req.cookies.token;

  if (!cookie || !cookie.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid C404");
  }

  const token = cookie.split(" ")[1];

  const isToken = await TokenBlackList.findOne({ token });
  if (isToken) {
    throw new UnauthenticatedError(`token is revoked`);
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new UnauthenticatedError("Token is expired");
  }

  if (!payload.isVerified) {
    throw new UnauthenticatedError("Account is not Verified");
  }

  req.user = { userId: payload.userId, name: payload.name };

  next();
};

module.exports = auth;
