const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { emailVerification, passwordMail } = require("../utils/mails");

const EXPIRES = 1 * 60 * 60 * 1000; // 8 hours

const login = async (req, res) => {
  const { email, password } = req.value;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError(`User with email:${email} not found`);
  }

  const isTrue = await user.comparePassword(password);
  if (!isTrue) {
    throw new BadRequestError("password is incorrect");
  }

  const verification = await user.verification.isVerified;

  if (!verification) {
    throw new UnauthenticatedError("Verify your account");
  }

  const token = user.genToken();
  res
    .status(StatusCodes.OK)
    .cookie("token", `Bearer ${token}`, {
      expires: new Date(Date.now() + EXPIRES),
      secure: "production",
      httpOnly: true,
    })
    .json({
      name: user.name,
      token: token,
      isVerified: user.verification.isVerified,
    });
};

const register = async (req, res) => {
  const { name, email, password } = req.value;

  const user = new User({ name, email, password });
  const token = user.genToken();
  const emailToken = await user.genVerification();

  await user.save();
  res
    .status(StatusCodes.CREATED)
    .cookie("token", `Bearer ${token}`, {
      expires: new Date(Date.now() + EXPIRES),
      secure: "production",
      httpOnly: true,
    })
    .json({
      message: "confirm email to be verified",
      name: name,
      token: token,
    });
  await emailVerification(user.email, emailToken);
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(`User not found for the provided email`);
  }

  const token = await user.genReset();

  user.save();
  res.status(StatusCodes.OK).json({ message: "Check email" });
  await passwordMail(email, token);
};

module.exports = {
  login,
  register,
  forgotPassword,
};
