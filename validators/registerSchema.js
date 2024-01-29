const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.min": "name should be at least {#limit} character long",
    "string.max": "name should not exceed to {#limit} character",
    "any.required": "Provide name",
  }),
  email: Joi.string().email().min(3).required().messages({
    "string.email": "invalid email",
    "any.required": "please provide an email",
    "string.min": "email should be at least {#limit} character long",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "password should be at least {#limit} character long",
    "any.required": "please provide a password",
  }), // .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"<>,./?]+$'))
});

module.exports = registerSchema;
