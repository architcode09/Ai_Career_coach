const mongoose = require("mongoose");
const Assessment = require("../models/Assessment");

const ALLOWED_TYPES = ["skills", "personality", "career-fit", "interview-readiness"];
const ALLOWED_STATUSES = ["pending", "in-progress", "completed"];

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
};

const normalizeQuestion = (question, index) => {
  const answer = question?.answer && typeof question.answer === "object" ? question.answer : {};

  return {
    id: String(question?.id || index + 1),
    question: String(question?.question || "").trim(),
    type: String(question?.type || "multiple-choice").trim(),
    options: normalizeStringArray(question?.options),
    answer: {
      correct: String(answer.correct || ""),
      user: String(answer.user || ""),
      isCorrect: Boolean(answer.isCorrect),
      explanation: String(answer.explanation || ""),
    },
  };
};

const sanitizeAssessmentPayload = (body, { partial = false } = {}) => {
  const payload = {};

  if (!partial || body.type !== undefined) {
    if (!ALLOWED_TYPES.includes(body.type)) {
      throw Object.assign(new Error("Invalid assessment type"), { statusCode: 400 });
    }
    payload.type = body.type;
  }

  if (!partial || body.title !== undefined) {
    const title = String(body.title || "").trim();
    if (!title) {
      throw Object.assign(new Error("Assessment title is required"), { statusCode: 400 });
    }
    payload.title = title;
  }

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      throw Object.assign(new Error("Invalid assessment status"), { statusCode: 400 });
    }
    payload.status = body.status;
  }

  if (body.questions !== undefined) {
    if (!Array.isArray(body.questions)) {
      throw Object.assign(new Error("questions must be an array"), { statusCode: 400 });
    }

    payload.questions = body.questions
      .map((question, index) => normalizeQuestion(question, index))
      .filter((question) => question.question.length > 0);
  }

  if (body.score !== undefined) payload.score = Number(body.score) || 0;
  if (body.maxScore !== undefined) payload.maxScore = Number(body.maxScore) || 100;
  if (body.aiAnalysis !== undefined) payload.aiAnalysis = String(body.aiAnalysis || "");
  if (body.recommendations !== undefined) payload.recommendations = normalizeStringArray(body.recommendations);
  if (body.strengths !== undefined) payload.strengths = normalizeStringArray(body.strengths);
  if (body.improvements !== undefined) payload.improvements = normalizeStringArray(body.improvements);
  if (body.timeSpent !== undefined) payload.timeSpent = Number(body.timeSpent) || 0;

  return payload;
};

const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ assessments });
  } catch (error) {
    return next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const payload = sanitizeAssessmentPayload(req.body);

    const assessment = await Assessment.create({
      ...payload,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Assessment created",
      assessment,
    });
  } catch (error) {
    return next(error);
  }
};

const getAssessmentById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid assessment id" });
    }

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.status(200).json({ assessment });
  } catch (error) {
    return next(error);
  }
};

const updateAssessment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid assessment id" });
    }

    const payload = sanitizeAssessmentPayload(req.body, { partial: true });

    const assessment = await Assessment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.status(200).json({
      message: "Assessment updated",
      assessment,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteAssessment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid assessment id" });
    }

    const assessment = await Assessment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    return res.status(200).json({ message: "Assessment deleted" });
  } catch (error) {
    return next(error);
  }
};

const completeAssessment = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid assessment id" });
    }

    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const payload = sanitizeAssessmentPayload(req.body, { partial: true });

    Object.assign(assessment, payload);
    assessment.status = "completed";

    await assessment.save();

    return res.status(200).json({
      message: "Assessment completed",
      assessment,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAssessments,
  createAssessment,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  completeAssessment,
};
