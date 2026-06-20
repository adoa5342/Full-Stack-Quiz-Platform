import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizHistory } from "../api/quizApi";
import "./Review.css";

function QuizHistory() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setError("");

        const data = await getQuizHistory();
        const historyScores = data?.scores || [];

        setScores(historyScores);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Failed to load quiz history"
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading-card">
          <div className="spinner"></div>
          <p>Loading quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <h1>Quiz History</h1>

        {error && <p className="error-message">{error}</p>}

        {!error && scores.length === 0 && (
          <div className="history-card">
            <p>No quiz attempts yet.</p>
          </div>
        )}

        {!error &&
          scores.map((attempt) => (
            <div className="history-card" key={attempt._id}>
              <h3>
                <strong>Score: </strong>
                {attempt.score} / {attempt.totalQuestions}
              </h3>

              <p>Date: {new Date(attempt.createdAt).toLocaleString()}</p>

              <Link className="review-link" to={`/quiz/review/${attempt._id}`}>
                Review attempt
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}

export default QuizHistory;