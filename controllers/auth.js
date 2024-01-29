const { NotFoundError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const verification = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ "verification.token": token });

  if (!user) {
    throw new NotFoundError("Route does not exist");
  }

  const isExpired = user.isVerificationTokenExpired();
  if (isExpired) {
    throw new BadRequestError(`Token is expired`);
  }

  user.verification.isVerified = true;
  user.verification.token = undefined;
  user.verification.expireAt = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Verified successfully" });
};

const customPasswordLink = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ "reset.token": token });

  if (!user) {
    throw new NotFoundError("Route does not exist");
  }

  const isExpired = user.isResetTokenExpired();
  if (isExpired) {
    throw new BadRequestError(`Token is expired`);
  }

  res.status(StatusCodes.OK).json({ message: "Route Exist" });
};

const changePassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  const user = await User.findOne({ "reset.token": token });

  if (!user) {
    throw new NotFoundError("Route does not exist");
  }

  const isExpired = user.isResetTokenExpired();
  if (isExpired) {
    throw new BadRequestError(`Token is expired`);
  }

  if (!newPassword || !confirmPassword) {
    throw new BadRequestError(`Provide new and confirm password`);
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError(
      `new password should be equal to confirm password`
    );
  }

  user.password = newPassword;
  user.reset.token = undefined;
  user.reset.expireAt = undefined;

  await user.save();

  res.status(StatusCodes.OK).json({ message: "Password successfully change" });
};

module.exports = {
  verification,
  customPasswordLink,
  changePassword,
};
