const express = require("express");
const router = express.Router();

const { login, register, forgotPassword } = require("../controllers/public");
const validate = require("../utils/validation");
const { loginSchema, registerSchema } = require("../validators");

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/forgot-password", forgotPassword);

module.exports = router;
