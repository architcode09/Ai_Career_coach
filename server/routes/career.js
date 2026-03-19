const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getCareerProfile,
  updateCareerProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  getResume,
  updateResume,
  getCoverLetters,
  createCoverLetter,
  getCoverLetterById,
  deleteCoverLetter,
  getIndustryInsights,
  updateIndustryInsights,
} = require("../controllers/careerController");

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getCareerProfile);
router.put("/profile", updateCareerProfile);

router.post("/experience", addExperience);
router.put("/experience/:id", updateExperience);
router.delete("/experience/:id", deleteExperience);

router.post("/education", addEducation);
router.put("/education/:id", updateEducation);
router.delete("/education/:id", deleteEducation);

// Compatibility endpoints for the existing frontend.
router.get("/resume", getResume);
router.put("/resume", updateResume);

router.get("/cover-letters", getCoverLetters);
router.post("/cover-letters", createCoverLetter);
router.get("/cover-letters/:id", getCoverLetterById);
router.delete("/cover-letters/:id", deleteCoverLetter);

router.get("/insights", getIndustryInsights);
router.put("/insights", updateIndustryInsights);

module.exports = router;
