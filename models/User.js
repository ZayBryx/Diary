const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const TOKEN_EXPIRATION_TIME = 20 * 60 * 1000; //20mins

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: [true, "Provide a Email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    minlength: 8,
    require: [true, "Provide a password"],
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: undefined,
    },
    expireAt: {
      type: Date,
      default: undefined,
    },
  },
  reset: {
    token: {
      type: String,
      default: undefined,
    },
    expireAt: {
      type: Date,
      default: undefined,
    },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.genToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.name,
      isVerified: this.verification.isVerified,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFE }
  );
};

userSchema.methods.comparePassword = async function (inputPassword) {
  const isMatch = await bcrypt.compare(inputPassword, this.password);
  return isMatch;
};

userSchema.methods.genVerification = async function () {
  const random = crypto.randomBytes(20).toString("hex");

  this.verification.token = random;
  this.verification.expireAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  return random;
};

userSchema.methods.isVerificationTokenExpired = function () {
  return this.verification.expireAt < new Date();
};

userSchema.methods.genReset = async function () {
  const random = crypto.randomBytes(20).toString("hex");

  this.reset.token = random;
  this.reset.expireAt = new Date(Date.now() + TOKEN_EXPIRATION_TIME);

  return random;
};

userSchema.methods.isResetTokenExpired = function () {
  return this.reset.expireAt < new Date();
};

module.exports = mongoose.model("User", userSchema);
