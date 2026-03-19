import api from "@/src/services/api";

export const getGoals = async () => {
  const response = await api.get("/goals");
  return response.data?.goals || [];
};

export const createGoal = async (payload) => {
  const response = await api.post("/goals", payload);
  return response.data?.goal;
};

export const getGoalById = async (goalId) => {
  const response = await api.get(`/goals/${goalId}`);
  return response.data?.goal;
};

export const updateGoal = async (goalId, payload) => {
  const response = await api.put(`/goals/${goalId}`, payload);
  return response.data?.goal;
};

export const deleteGoal = async (goalId) => {
  await api.delete(`/goals/${goalId}`);
  return true;
};

export const updateGoalProgress = async (goalId, progress) => {
  const response = await api.patch(`/goals/${goalId}/progress`, { progress });
  return response.data?.goal;
};
