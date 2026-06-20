import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import API from "../api/api";
import "../App.css";
import "../components/Leaderboard.css";

function Home() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [topScores, setTopScores] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await API.get("/leaderboard");
        const rows = response.data?.data;

        setTopScores(Array.isArray(rows) ? rows.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to load leaderboard preview:", err);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankClass = (rank) => {
    if (rank === 1) return "rank-one";
    if (rank === 2) return "rank-two";
    if (rank === 3) return "rank-three";
    return "";
  };

  if (token && user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/quiz"} replace />;
  }

  return (
    <div className="home-page">
      <section className="home-section">
        <h1>Test Your Knowledge</h1>

        <p>
          Challenge yourself with a diverse range of quiz questions, track your
          scores over time, and see how you measure up against other players on
          the leaderboard.
        </p>

        <p>
          Whether you're here to learn something new or prove you're the best,
          there's always another question waiting for you.
        </p>

        <div className="home-button-row">
          <Link to="/login" className="green-button">
            Login/Register &#x1F80A;
          </Link>
        </div>
      </section>

      <section className="home-section">
        <h2>What You Can Do</h2>

        <div>
          <h3>Take Quizzes</h3>
          <p>
            Dive into a curated set of randomised questions spanning a wide
            range of topics.
          </p>
          <p>
            Each quiz session is a fresh challenge — answers are evaluated
            instantly so you always know where you stand the moment you finish.
          </p>

          <h3>Create Your Own Questions</h3>
          <p>Have knowledge and fun facts worth sharing?</p>
          <p>
            Craft your own quiz questions and contribute to the ever-growing
            question pool. Your submissions help keep the quiz fresh and
            challenging for every player on the platform.
          </p>

          <h3>Leaderboard</h3>
          <p>
            Your best quiz score is measured against other players and ranked on
            a live leaderboard.
          </p>
          <p>
            Climb the ranks, hold your position, and see if you have what it
            takes to reach the top spot.
          </p>
        </div>

        {leaderboardLoading && (
          <p className="home-loading-text">Loading leaderboard...</p>
        )}

        {!leaderboardLoading && topScores.length === 0 && (
          <p className="home-loading-text">No scores yet — be the first!</p>
        )}

        {!leaderboardLoading && topScores.length > 0 && (
          <div className="leaderboard-table-wrapper home-leaderboard-preview">
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
                {topScores.map((row) => (
                  <tr key={`${row.username}-${row.rank}`}>
                    <td>
                      <span className={`rank-badge ${getRankClass(row.rank)}`}>
                        #{row.rank}
                      </span>
                    </td>

                    <td
                      className={`leaderboard-username ${getRankClass(
                        row.rank
                      )}`}
                    >
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
      </section>
    </div>
  );
}

export default Home;