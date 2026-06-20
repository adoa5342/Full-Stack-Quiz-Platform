import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const user = res.data.data.user;

      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/quiz", { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div class="acc-box">
      <h1 id="page-name">Login</h1>
      <input class = "field"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input class="field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button id="submit" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;