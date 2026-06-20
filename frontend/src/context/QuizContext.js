import { createContext, useContext, useReducer } from "react";

const QuizContext = createContext(null);

const initialState = {
  questions: [],
  selectedAnswers: {},
  result: null,
  loading: true,
  submitLoading: false,
  error: "",
};

function quizReducer(state, action) {
  switch (action.type) {
    case "LOAD_START":
      return {
        ...state,
        loading: true,
        error: "",
        result: null,
        selectedAnswers: {},
      };

    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        questions: action.payload,
      };

    case "LOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "SELECT_ANSWER":
      if (state.result) {
        return state;
      }

      return {
        ...state,
        selectedAnswers: {
          ...state.selectedAnswers,
          [action.payload.questionId]: action.payload.optionIndex,
        },
      };

    case "SUBMIT_START":
      return {
        ...state,
        submitLoading: true,
        error: "",
      };

    case "SUBMIT_SUCCESS":
      return {
        ...state,
        submitLoading: false,
        result: action.payload,
      };

    case "SUBMIT_ERROR":
      return {
        ...state,
        submitLoading: false,
        error: action.payload,
      };

    case "RESET_QUIZ":
      return {
        ...initialState,
      };

    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);

  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }

  return context;
}