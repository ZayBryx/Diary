const express = require("express");
const router = express.Router();

const {
  verification,
  changePassword,
  customPasswordLink,
} = require("../controllers/auth");

router.get("/verification/:token", verification);
router.get("/change-password/:token", customPasswordLink);
router.patch("/change-password/:token", changePassword);

module.exports = router;
