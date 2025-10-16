import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img002 from "../assets/img003.jpg";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
import kimple from "../assets/kimple.png";

function OldNotes() {
  const navigate = useNavigate();
  const [dropdown, setDropDown] = useState(false);
  const [notes, setNotes] = useState([]);
  const { setUser } = useContext(AuthContext);
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
        const mappedNotes = data.map((note) => ({ ...note, id: note._id }));
        setNotes(mappedNotes);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotes();
  }, [navigate, API_URL]);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      console.log(err);
      alert("Error deleting note");
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

  return (
    <div
      style={{
        backgroundImage: `url(${img002})`,
        backgroundSize: "cover",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
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
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  marginTop: "0.5rem",
                }}
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

      <div
        className="smallHeader"
        style={{
          maxWidth: "500px",
          margin: "1rem auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // center children
          background: "white",
          padding: "16px 16px",
          borderRadius: "12px",
          position: "relative", // allows absolute positioning for button
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            left: "16px", // stick to left edge
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          ←
        </button>

        <h2 className="profilefont" style={{ margin: 0 }}>
          OldNotes
        </h2>
      </div>

      <div className="content">
        <h3
          style={{
            color: "white",
            fontFamily: "cursive",
            fontWeight: "900",
            fontSize: "24px",
          }}
        >
          📜 All Notes:
        </h3>
        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h2 style={{ color: "red" }}>No Data found.</h2>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card-2">
                {/* ✅ render formatted HTML */}
                <div
                  className="note-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.content),
                  }}
                />
                <button onClick={() => handleEdit(note)}>✏️ Edit</button>
                <button onClick={() => handleDelete(note.id)}>❌ Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OldNotes;
