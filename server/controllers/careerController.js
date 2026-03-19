const mongoose = require("mongoose");
const CareerProfile = require("../models/CareerProfile");

const getOrCreateCareerProfile = async (userId) => {
  let profile = await CareerProfile.findOne({ user: userId });
  if (!profile) {
    profile = await CareerProfile.create({ user: userId });
  }
  return profile;
};

const getCareerProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);
    return res.status(200).json({ profile });
  } catch (error) {
    return next(error);
  }
};

const updateCareerProfile = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);

    const allowedFields = [
      "targetRole",
      "targetIndustry",
      "careerStage",
      "salaryExpectation",
      "workPreference",
      "technicalSkills",
      "softSkills",
      "certifications",
      "education",
      "experience",
      "aiSummary",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    return res.status(200).json({
      message: "Career profile updated",
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const addExperience = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);
    profile.experience.push(req.body);
    await profile.save();

    return res.status(201).json({
      message: "Experience added",
      experience: profile.experience[profile.experience.length - 1],
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const updateExperience = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const experience = profile.experience.id(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    Object.keys(req.body).forEach((key) => {
      experience[key] = req.body[key];
    });

    await profile.save();

    return res.status(200).json({
      message: "Experience updated",
      experience,
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteExperience = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid experience id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const experience = profile.experience.id(req.params.id);

    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    experience.deleteOne();
    await profile.save();

    return res.status(200).json({
      message: "Experience deleted",
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const addEducation = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);
    profile.education.push(req.body);
    await profile.save();

    return res.status(201).json({
      message: "Education added",
      education: profile.education[profile.education.length - 1],
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid education id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const education = profile.education.id(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    Object.keys(req.body).forEach((key) => {
      education[key] = req.body[key];
    });

    await profile.save();

    return res.status(200).json({
      message: "Education updated",
      education,
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid education id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const education = profile.education.id(req.params.id);

    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    education.deleteOne();
    await profile.save();

    return res.status(200).json({
      message: "Education deleted",
      profile,
    });
  } catch (error) {
    return next(error);
  }
};

const getResume = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);
    return res.status(200).json({
      content: profile.resumeContent || "",
      updatedAt: profile.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

const updateResume = async (req, res, next) => {
  try {
    const { content } = req.body;
    const profile = await getOrCreateCareerProfile(req.user.id);
    profile.resumeContent = content || "";
    await profile.save();

    return res.status(200).json({
      message: "Resume saved",
      content: profile.resumeContent,
      updatedAt: profile.updatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

const getCoverLetters = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);

    const letters = [...(profile.coverLetters || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((letter) => ({
        id: letter._id.toString(),
        companyName: letter.companyName,
        jobTitle: letter.jobTitle,
        jobDescription: letter.jobDescription,
        content: letter.content,
        status: letter.status,
        createdAt: letter.createdAt,
        updatedAt: letter.updatedAt,
      }));

    return res.status(200).json({ letters });
  } catch (error) {
    return next(error);
  }
};

const createCoverLetter = async (req, res, next) => {
  try {
    const { companyName, jobTitle, jobDescription, content, status } = req.body;

    const profile = await getOrCreateCareerProfile(req.user.id);
    profile.coverLetters.push({
      companyName,
      jobTitle,
      jobDescription,
      content,
      status: status || "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await profile.save();

    const created = profile.coverLetters[profile.coverLetters.length - 1];

    return res.status(201).json({
      message: "Cover letter created",
      letter: {
        id: created._id.toString(),
        companyName: created.companyName,
        jobTitle: created.jobTitle,
        jobDescription: created.jobDescription,
        content: created.content,
        status: created.status,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getCoverLetterById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid cover letter id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const letter = profile.coverLetters.id(req.params.id);

    if (!letter) {
      return res.status(404).json({ message: "Cover letter not found" });
    }

    return res.status(200).json({
      letter: {
        id: letter._id.toString(),
        companyName: letter.companyName,
        jobTitle: letter.jobTitle,
        jobDescription: letter.jobDescription,
        content: letter.content,
        status: letter.status,
        createdAt: letter.createdAt,
        updatedAt: letter.updatedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCoverLetter = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid cover letter id" });
    }

    const profile = await getOrCreateCareerProfile(req.user.id);
    const letter = profile.coverLetters.id(req.params.id);

    if (!letter) {
      return res.status(404).json({ message: "Cover letter not found" });
    }

    letter.deleteOne();
    await profile.save();

    return res.status(200).json({ message: "Cover letter deleted" });
  } catch (error) {
    return next(error);
  }
};

const getIndustryInsights = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);

    return res.status(200).json({
      insights: profile.industryInsights,
      updatedAt: profile.insightsUpdatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

const updateIndustryInsights = async (req, res, next) => {
  try {
    const profile = await getOrCreateCareerProfile(req.user.id);
    profile.industryInsights = req.body.insights || null;
    profile.insightsUpdatedAt = new Date();
    await profile.save();

    return res.status(200).json({
      message: "Industry insights updated",
      insights: profile.industryInsights,
      updatedAt: profile.insightsUpdatedAt,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
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
};
