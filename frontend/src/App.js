import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { QuizProvider } from "./context/QuizContext";

import Home from "./pages/Home";
import AuthPage from "./components/AuthPage";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import QuizHistory from "./components/QuizHistory";
import QuizReview from "./components/QuizReview";
import Admin from "./pages/Admin";

import "./App.css";
import "./Theme.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/quiz" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const isLoggedIn = Boolean(localStorage.getItem("token")) && Boolean(user);
  const isAdmin = user?.role === "admin";

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <Router>
      <div className={`app ${theme}-theme`}>
        <nav className="navbar">
          <Link
            to={isLoggedIn ? (isAdmin ? "/admin" : "/quiz") : "/"}
            className="brand"
          >
            Quiz App
          </Link>

          <div className="nav-links">
            {!isLoggedIn ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/leaderboard">Leaderboard</Link>

                <button type="button" onClick={toggleTheme} className="theme-toggle">
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>
              </>
            ) : isAdmin ? (
              <>
                <Link to="/admin">Admin Panel</Link>
                <Link to="/quiz">Quiz</Link>
                <Link to="/quiz/history">History</Link>
                <Link to="/leaderboard">Leaderboard</Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle"
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/quiz">Quiz</Link>
                <Link to="/quiz/history">History</Link>
                <Link to="/leaderboard">Leaderboard</Link>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="theme-toggle"
                >
                  {theme === "light" ? "Dark Mode" : "Light Mode"}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<AuthPage setUser={setUser} />} />

            <Route
              path="/register"
              element={<Navigate to="/login" replace />}
            />

            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizProvider>
                    <Quiz />
                  </QuizProvider>
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/history"
              element={
                <ProtectedRoute>
                  <QuizHistory />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/review/:scoreId"
              element={
                <ProtectedRoute>
                  <QuizReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin theme={theme} />
                </AdminRoute>
              }
            />

            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;