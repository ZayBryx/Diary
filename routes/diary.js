const express = require("express");
const router = express.Router();
const {
  getAll,
  getOne,
  createDiary,
  update,
  deleteOne,
} = require("../controllers/diary");

router.route("/").post(createDiary).get(getAll);
router.route("/:id").get(getOne).patch(update).delete(deleteOne);

module.exports = router;
