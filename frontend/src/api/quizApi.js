import API from "./api";

const unwrapResponse = (response) => {
  if (response.data?.success) {
    return response.data.data;
  }

  return response.data;
};

export const getQuizQuestions = async () => {
  const response = await API.get("/quiz/questions");
  return unwrapResponse(response);
};

export const submitQuiz = async (answers) => {
  const response = await API.post("/quiz/submit", { answers });
  return unwrapResponse(response);
};

export const getQuizHistory = async () => {
  const response = await API.get("/quiz/history");
  return unwrapResponse(response);
};

export const getQuizReview = async (scoreId) => {
  const response = await API.get(`/quiz/review/${scoreId}`);
  return unwrapResponse(response);
};