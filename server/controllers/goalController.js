const mongoose = require("mongoose");
const Goal = require("../models/Goal");

const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ goals });
  } catch (error) {
    return next(error);
  }
};

const createGoal = async (req, res, next) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Goal created",
      goal,
    });
  } catch (error) {
    return next(error);
  }
};

const getGoalById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid goal id" });
    }

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    return res.status(200).json({ goal });
  } catch (error) {
    return next(error);
  }
};

const updateGoal = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid goal id" });
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    return res.status(200).json({
      message: "Goal updated",
      goal,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteGoal = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid goal id" });
    }

    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    return res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    return next(error);
  }
};

const updateGoalProgress = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid goal id" });
    }

    const { progress } = req.body;

    const goal = await Goal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.progress = Math.max(0, Math.min(100, Number(progress) || 0));
    if (goal.progress === 100) {
      goal.status = "completed";
    } else if (goal.status === "not-started") {
      goal.status = "in-progress";
    }

    await goal.save();

    return res.status(200).json({
      message: "Goal progress updated",
      goal,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getGoals,
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  updateGoalProgress,
};
