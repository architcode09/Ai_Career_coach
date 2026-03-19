const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getGoals,
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
} = require("../controllers/goalController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getGoals);
router.post("/", createGoal);
router.get("/:id", getGoalById);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.patch("/:id/progress", updateGoalProgress);

module.exports = router;
