import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import kimple from "../assets/kimple.png";

function Auth() {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleAuth = async (e) => {
    e.preventDefault();

    // ✅ validation
    if (!email || !password) {
      return setError("Email and password are required");
    }

    if (!isLogin && !fullName) {
      return setError("Full name is required");
    }

    try {
      setError("");
      setLoading(true);

      const url = isLogin
        ? `${API_URL}/api/login`
        : `${API_URL}/api/signup`;

      const body = isLogin
        ? JSON.stringify({ email, password })
        : JSON.stringify({ fullName, email, password });

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        credentials: "include",
      });

      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Authentication failed");
      }

      setUser(data.user);
      navigate("/");

      // reset
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img className="logo" src={kimple} alt="App Logo" />
      </div>

      <div className="auth-form">
        <h1>{isLogin ? "Login" : "Create new Account"}</h1>

        {/* ✅ everything inside form */}
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter Full Name"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />

          <button className="authBtn" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {error && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>
        )}

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            style={{ color: "#667eea", cursor: "pointer" }}
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;