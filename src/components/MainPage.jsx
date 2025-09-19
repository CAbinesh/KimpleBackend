import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import img3 from "../assets/img3.jpg";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
import kimple from "../assets/kimple.png";
function MainPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropDown] = useState(false);
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/auth");
          return;
        }
        const data = await res.json();
        setNotes(data.map((note) => ({ ...note, id: note._id })));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [navigate,API_URL]);

  const latest = notes.slice(0, 3);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (note) => navigate("/new", { state: { note } });

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/auth");
    alert("Logged out");
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "white" }}>Loading notes...</p>
    );

  return (
    <div
      style={{
        backgroundImage: `url(${img3})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.65)",
          borderRadius: "1rem",
          padding: "1.5rem",
          color: "white",
        }}
      >
        {/* <div className="Title ">
          <h1>Notes..🪶</h1>
        </div> */}

        <div className="Header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              className="logo"
              src={kimple}
              alt="My App Logo"
              style={{ height: "80px", marginLeft: "10px" }}
            />
          </div>
          <div className="subHeader">
            <h4
              className="profilefont"
              onClick={() => navigate("/new")}
              style={{ cursor: "pointer" }}
            >
              Create
            </h4>
            <h4
              className="profilefont"
              onClick={() => navigate("/oldnotes")}
              style={{ cursor: "pointer" }}
            >
              Old Notes
            </h4>
            <div className="dropdown">
              <h4
                className="profilefont"
                onClick={() => setDropDown(!dropdown)}
                style={{ cursor: "pointer" }}
              >
                Profile
              </h4>
              {dropdown && (
                <div
                  className="dropdown-menu"
                  
                >
                  <p
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    View Profile
                  </p>
                  <p style={{ cursor: "pointer" }} onClick={handleLogout}>
                    Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="Content" style={{ marginTop: "2rem" }}>
          <h3>📝 Last 3 Notes:</h3>
          <div
            className="Content-container"
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
          >
            {latest.length === 0 ? (
              <h1 style={{ color: "white" }}>Create new ☝️</h1>
            ) : (
              latest.map((note) => (
                <div key={note.id} className="note-card">
                  {/* ✅ Fix: render formatted HTML instead of raw tags */}
                  <div
                    className="note-content"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(note.content),
                    }}
                  />

                  <button onClick={() => handleEdit(note)}>✏️ Edit</button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    style={{ marginRight: "0.5rem" }}
                  >
                    ❌ Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className="Footer"
          style={{ marginTop: "3rem", textAlign: "center" }}
        >
          <h5>©2025 All Rights Reserved</h5>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
