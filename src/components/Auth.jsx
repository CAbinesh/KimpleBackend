import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import img002 from "../assets/img002.jpg";
import kimple from "../assets/kimple.png";

function Auth() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleAuth = async () => {
    try {
      setError("");

      const url = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/signup`;

      const body = isLogin
        ? JSON.stringify({ email, password })
        : JSON.stringify({ fullName, email, password });

      const headers = { "Content-Type": "application/json" };

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
        credentials: "include",
      });

      let data;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server returned no JSON");
      }

      if (!res.ok) throw new Error(data?.message || "Authentication failed");

      setUser(data.user);
      navigate("/");

      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${img002})`, backgroundSize: "contain",minHeight:'100vh' }}
    >
      <div className="auth-form">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            className="logo"
            src={kimple}
            alt="My App Logo"
            style={{ height: "100px",width:"100px" }}
          />
        </div>
        <h1>{isLogin ? "Login" : "Create new Account"}</h1>

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

        <button onClick={handleAuth}>{isLogin ? "Login" : "Sign Up"}</button>

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            style={{ color: "#007bff", cursor: "pointer" }}
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
