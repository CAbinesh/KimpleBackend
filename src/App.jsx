/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./components/MainPage";
import New from "./components/New";
import OldNotes from "./components/OldNotes";
import Auth from "./components/Auth";
import Profile from "./components/Profile";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          credentials: "include", // ✅ send cookie
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API_URL]);

  if (loading)
    return (
      <div
        style={{
          backgroundColor: "black",
          width: "100vw",
          height: "100vh",
        }}
      >
        <div className="loader-wrapper">
          <span className="loader-letter">S</span>
          <span className="loader-letter">e</span>
          <span className="loader-letter">t</span>
          <span className="loader-letter">t</span>
          <span className="loader-letter">i</span>
          <span className="loader-letter">n</span>
          <span className="loader-letter">g</span>
          <span className="loader-letter"> </span>
          <span className="loader-letter">u</span>
          <span className="loader-letter">p</span>
          <span className="loader-letter">.</span>
          <span className="loader-letter">.</span>
          <span className="loader-letter">.</span>

          <div className="loader"></div>
        </div>
      </div>
    );

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route
          path="/"
          element={user ? <MainPage /> : <Navigate to="/auth" />}
        />
        <Route path="/new" element={user ? <New /> : <Navigate to="/auth" />} />
        <Route
          path="/oldnotes"
          element={user ? <OldNotes /> : <Navigate to="/auth" />}
        />
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/auth" />}
        />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
