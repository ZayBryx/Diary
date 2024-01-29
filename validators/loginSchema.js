const Joi = require("joi");

const loginSchema = Joi.object({
  // .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"<>,./?]+$'))
  email: Joi.string().email().min(3).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref("password"),
});

module.exports = loginSchema;
