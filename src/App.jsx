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
  }, []);

  if (loading) return <h1>Loading...</h1>;

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
