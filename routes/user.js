const express = require("express");
const router = express.Router();

const { home, logout, changePassword } = require("../controllers/user");

router.get("/home", home);
router.delete("/logout", logout);
router.patch("/change-password", changePassword);

module.exports = router;
