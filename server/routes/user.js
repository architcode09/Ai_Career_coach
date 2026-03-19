const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/userController");

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.delete("/account", deleteAccount);

module.exports = router;
