import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getQuizQuestions, submitQuiz } from "../api/quizApi";
import { useQuiz } from "../context/QuizContext";
import "./Quiz.css";

function Quiz() {
  const { state, dispatch } = useQuiz();

  const {
    questions,
    selectedAnswers,
    result,
    loading,
    submitLoading,
    error,
  } = state;

  const loadQuestions = async () => {
    try {
      dispatch({ type: "LOAD_START" });

      const data = await getQuizQuestions();

      dispatch({
        type: "LOAD_SUCCESS",
        payload: data.questions || [],
      });
    } catch (err) {
      dispatch({
        type: "LOAD_ERROR",
        payload:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load quiz questions",
      });
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleAnswerChange = (questionId, optionIndex) => {
    dispatch({
      type: "SELECT_ANSWER",
      payload: {
        questionId,
        optionIndex,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      dispatch({ type: "SUBMIT_START" });

      if (!localStorage.getItem("token")) {
        dispatch({
          type: "SUBMIT_ERROR",
          payload: "You must be logged in to submit the quiz.",
        });
        return;
      }

      const answers = questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: selectedAnswers[question._id],
      }));

      const data = await submitQuiz(answers);

      dispatch({
        type: "SUBMIT_SUCCESS",
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: "SUBMIT_ERROR",
        payload:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to submit quiz",
      });
    }
  };

  const handleTakeAnotherQuiz = () => {
    loadQuestions();
  };

  const allAnswered =
    questions.length > 0 &&
    questions.every((question) => selectedAnswers[question._id] !== undefined);

  const answeredCount = Object.keys(selectedAnswers).length;

  if (loading) {
    return (
      <div className="quiz-layout">
        <div className="quiz-card loading-card">
          <div className="spinner"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-layout">
      <aside className="quiz-side-panel left-side-panel">
        <h3>Quiz Tips</h3>
        <p>Read each question carefully before submitting.</p>
        <p>All questions must be answered before the quiz can be marked.</p>
        <p>Your score and review will appear after submission.</p>
      </aside>

      <div className="quiz-card animate-card">
        <div className="quiz-header">
          <div>
            <h1>Quiz</h1>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        {questions.length === 0 && <p>No quiz questions available.</p>}

        {questions.map((question, index) => (
          <div key={question._id} className="question-block">
            <span className="question-badge">
              Question {index + 1} of {questions.length}
            </span>

            <h3>{question.questionText}</h3>

            <div className="options-grid">
              {question.options.map((option, optionIndex) => {
                const isSelected =
                  selectedAnswers[question._id] === optionIndex;

                return (
                  <button
                    type="button"
                    key={optionIndex}
                    className={`option-card ${
                      isSelected ? "selected-option" : ""
                    } ${result ? "locked-option" : ""}`}
                    onClick={() =>
                      handleAnswerChange(question._id, optionIndex)
                    }
                    disabled={!!result}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {questions.length > 0 && !result && (
          <div className="submit-row">
            <button
              type="button"
              className="submit-button"
              onClick={handleSubmit}
              disabled={!allAnswered || submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        )}

        {result && (
          <div className="result-card pop-in">
            <h2>Result</h2>

            <p className="score-text">
              {result.score} / {result.totalQuestions}
            </p>

            <p className="score-percent">
              You scored{" "}
              {Math.round((result.score / result.totalQuestions) * 100)}%.
            </p>

            <div className="result-actions">
              {result.scoreId && (
                <Link
                  className="review-link"
                  to={`/quiz/review/${result.scoreId}`}
                >
                  Review attempt
                </Link>
              )}

              <button
                type="button"
                className="take-again-button"
                onClick={handleTakeAnotherQuiz}
              >
                Take another quiz
              </button>
            </div>
          </div>
        )}
      </div>

      <aside className="quiz-side-panel right-side-panel">
        <h3>Progress</h3>

        <div className="side-stat">
          <span>Answered</span>
          <strong>
            {answeredCount}/{questions.length}
          </strong>
        </div>

        <div className="side-stat">
          <span>Status</span>
          <strong>{result ? "Completed" : "In progress"}</strong>
        </div>
      </aside>
    </div>
  );
}

export default Quiz;