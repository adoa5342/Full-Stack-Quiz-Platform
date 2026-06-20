import { useEffect, useState } from "react";
import API from "../api/api";
import "./Leaderboard.css";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/leaderboard");
        const rows = response.data?.data;

        setLeaderboard(Array.isArray(rows) ? rows : []);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-one";
    if (rank === 2) return "rank-two";
    if (rank === 3) return "rank-three";
    return "";
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-card">
        <h1>Leaderboard</h1>

        <p className="leaderboard-subtitle">
          Top quiz results based on each user's best attempt.
        </p>

        {loading && (
          <p className="leaderboard-message">Loading leaderboard...</p>
        )}

        {!loading && error && (
          <p className="leaderboard-error">{error}</p>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <div className="leaderboard-empty">
            <h3>No scores yet.</h3>
            <p>Scores will appear here after users complete quizzes.</p>
          </div>
        )}

        {!loading && !error && leaderboard.length > 0 && (
          <div className="leaderboard-table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Total Questions</th>
                </tr>
              </thead>

              <tbody>
                {leaderboard.map((row) => (
                  <tr key={`${row.username}-${row.rank}`}>
                    <td>
                      <span className={`rank-badge ${getRankClass(row.rank)}`}>
                        #{row.rank}
                      </span>
                    </td>

                    <td className={`leaderboard-username ${getRankClass(row.rank)}`}>
                      {row.username}
                    </td>

                    <td className="leaderboard-score">{row.score}</td>

                    <td className="leaderboard-total">
                      {row.totalQuestions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;