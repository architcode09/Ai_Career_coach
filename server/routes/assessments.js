const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAssessments,
  createAssessment,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  completeAssessment,
} = require("../controllers/assessmentController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAssessments);
router.post("/", createAssessment);
router.get("/:id", getAssessmentById);
router.put("/:id", updateAssessment);
router.delete("/:id", deleteAssessment);
router.post("/:id/complete", completeAssessment);

module.exports = router;
