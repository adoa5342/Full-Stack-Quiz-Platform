import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuizReview } from "../api/quizApi";
import "./Review.css";

function QuizReview() {
  const { scoreId } = useParams();

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReview = async () => {
      try {
        setError("");

        const data = await getQuizReview(scoreId);
        const reviewAttempt = data?.score || null;

        setAttempt(reviewAttempt);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load quiz review"
        );
      } finally {
        setLoading(false);
      }
    };

    loadReview();
  }, [scoreId]);

  if (loading) {
    return (
      <div className="review-page">
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading quiz review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-page">
        <div className="review-container">
          <h1>Quiz Review</h1>

          <p className="error-message">{error}</p>

          <Link className="review-link" to="/quiz/history">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="review-page">
        <div className="review-container">
          <h1>Quiz Review</h1>

          <div className="review-card">
            <p>No review found.</p>
          </div>

          <Link className="review-link" to="/quiz/history">
            Back to history
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="review-page">
      <div className="review-container">
        <h1>Quiz Review</h1>

        <div className="review-summary-card">
          <h3>
            <strong>Score: </strong>
            {attempt.score} / {attempt.totalQuestions}
          </h3>

          <Link className="review-link" to="/quiz/history">
            Back to history
          </Link>
        </div>

        {(attempt.answers || []).map((answer, index) => {
          const question = answer.questionId;

          if (!question) {
            return null;
          }

          const selectedOption =
            question.options?.[answer.selectedAnswer] || "No answer selected";

          const correctOption =
            question.options?.[question.correctAnswer] || "Unavailable";

          return (
            <div className="review-card" key={answer._id || index}>
              <h3>
                <span className="question-badge">
                  Question {index + 1}:
                </span>{" "}
                {question.questionText}
              </h3>

              <p>
                <strong>Your answer:</strong> {selectedOption}
              </p>

              <p>
                <strong>Correct answer:</strong> {correctOption}
              </p>

              <p>
                <strong>Result:</strong>{" "}
                <span
                  className={
                    answer.isCorrect ? "review-correct" : "review-incorrect"
                  }
                >
                  {answer.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </p>

              {question.explanation && (
                <p>
                  <strong>Explanation:</strong> {question.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuizReview;