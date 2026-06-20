import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import API from "../api/api";
import "./AuthPage.css";

const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function AuthPage({ setUser }) {
  const navigate = useNavigate();

  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = async (formData) => {
    try {
      setError("");
      setMessage("");
      setLoadingAction("login");

      const res = await API.post("/auth/login", {
        username: formData.username.trim(),
        password: formData.password,
      });

      const data = res.data?.data || res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (setUser) {
        setUser(data.user);
      }

      navigate(data.user?.role === "admin" ? "/admin" : "/quiz", {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoadingAction("");
    }
  };

  const handleRegister = async (formData) => {
    try {
      setError("");
      setMessage("");
      setLoadingAction("register");

      const res = await API.post("/auth/register", {
        username: formData.username.trim(),
        password: formData.password,
      });

      const data = res.data?.data || res.data;

      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (setUser) {
          setUser(data.user);
        }

        navigate(data.user?.role === "admin" ? "/admin" : "/quiz", {
          replace: true,
        });

        return;
      }

      setMessage("Registration successful. Please log in.");
      loginForm.reset();
      registerForm.reset();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoadingAction("");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <h1>Welcome to Quiz App</h1>
        <p>
          Log in to continue your quiz progress, or create a new account to get
          started.
        </p>
      </div>

      {(message || error) && (
        <div className={error ? "auth-alert auth-error" : "auth-alert"}>
          {error || message}
        </div>
      )}

      <div className="auth-split">
        <section
          className={`auth-panel login-panel ${
            hoveredPanel === "login" ? "active-panel" : ""
          } ${hoveredPanel === "register" ? "muted-panel" : ""}`}
          onMouseEnter={() => setHoveredPanel("login")}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="panel-content">
            <span className="panel-tag">Returning user</span>
            <h2>Login</h2>
            <p>Access your quiz, history, reviews, and leaderboard progress.</p>

            <form
              onSubmit={loginForm.handleSubmit(handleLogin)}
              className="auth-form"
              noValidate
            >
              <input
                type="text"
                placeholder="Username"
                {...loginForm.register("username")}
              />
              {loginForm.formState.errors.username && (
                <p className="auth-field-error">
                  {loginForm.formState.errors.username.message}
                </p>
              )}

              <input
                type="password"
                placeholder="Password"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="auth-field-error">
                  {loginForm.formState.errors.password.message}
                </p>
              )}

              <button type="submit" disabled={loadingAction === "login"}>
                {loadingAction === "login" ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </section>

        <section
          className={`auth-panel register-panel ${
            hoveredPanel === "register" ? "active-panel" : ""
          } ${hoveredPanel === "login" ? "muted-panel" : ""}`}
          onMouseEnter={() => setHoveredPanel("register")}
          onMouseLeave={() => setHoveredPanel(null)}
        >
          <div className="panel-content">
            <span className="panel-tag">New player</span>
            <h2>Register</h2>
            <p>Create an account to submit quizzes and save your attempts.</p>

            <form
              onSubmit={registerForm.handleSubmit(handleRegister)}
              className="auth-form"
              noValidate
            >
              <input
                type="text"
                placeholder="Choose a username"
                {...registerForm.register("username")}
              />
              {registerForm.formState.errors.username && (
                <p className="auth-field-error">
                  {registerForm.formState.errors.username.message}
                </p>
              )}

              <input
                type="password"
                placeholder="Choose a password"
                {...registerForm.register("password")}
              />
              {registerForm.formState.errors.password && (
                <p className="auth-field-error">
                  {registerForm.formState.errors.password.message}
                </p>
              )}

              <button type="submit" disabled={loadingAction === "register"}>
                {loadingAction === "register"
                  ? "Creating account..."
                  : "Register"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;