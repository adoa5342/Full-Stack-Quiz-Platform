import { useState } from "react";
import API from "../api/api";
import './LoginRegister.css';

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
        username,
        password,
      });

      alert("Registered successfully. You can now login.");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div class="acc-box">
      <h1 id="page-name">Register</h1>
      <input class="field"
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

      <button id="submit" onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;