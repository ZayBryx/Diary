const { StatusCodes } = require("http-status-codes");
const TokenBlackList = require("../models/TokenBlackList");

const home = async (req, res) => {
  const { name } = req.user;

  res.status(StatusCodes.OK).json({ name: name });
};

const logout = async (req, res) => {
  const cookie = req.cookies["token"];

  if (!cookie || !cookie.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  const token = cookie.split(" ")[1];
  const expirationDate = Date.now() + 1 * 60 * 60 * 1000;

  const blackList = await TokenBlackList.create({
    token,
    expirationDate,
  });

  res.clearCookie("token", { path: "/" });
  res.status(StatusCodes.OK).json({ message: "Logout Successfully" });
};

const changePassword = async (req, res) => {
  res.send("change password route");
};

module.exports = {
  home,
  logout,
  changePassword,
};
