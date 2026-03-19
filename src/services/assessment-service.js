import api from "@/src/services/api";

export const getAssessmentsApi = async () => {
  const response = await api.get("/assessments");
  return response.data?.assessments || [];
};

export const createAssessment = async (payload) => {
  const response = await api.post("/assessments", payload);
  return response.data?.assessment;
};

export const getAssessmentById = async (assessmentId) => {
  const response = await api.get(`/assessments/${assessmentId}`);
  return response.data?.assessment;
};

export const updateAssessment = async (assessmentId, payload) => {
  const response = await api.put(`/assessments/${assessmentId}`, payload);
  return response.data?.assessment;
};

export const deleteAssessment = async (assessmentId) => {
  await api.delete(`/assessments/${assessmentId}`);
  return true;
};

export const completeAssessment = async (assessmentId, payload) => {
  const response = await api.post(`/assessments/${assessmentId}/complete`, payload);
  return response.data?.assessment;
};
