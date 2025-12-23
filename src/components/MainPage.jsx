import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
import { IoLibrary } from "react-icons/io5";
import kimple from "../assets/kimple.png";
function MainPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
  }, [navigate, API_URL]);

  const latest = notes.slice(-3).reverse();

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
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", color: "white" }}>Loading notes...</p>
    );

  return (
    <div className="oldcontbg">
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.65)",
          borderRadius: "1rem",
          padding: "1.5rem",
          color: "white",
        }}
      >
        <div className="Header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <img className="headerLogo" src={kimple} alt="" />
            </div>
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
                <div className="dropdown-menu">
                  <p
                    onClick={() => navigate("/profile")}
                    style={{ cursor: "pointer" }}
                  >
                    View Profile
                  </p>
                  <p
                    onClick={() => setShowLogoutConfirm(true)}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </p>
                  {showLogoutConfirm && (
                    <div className="modalBackdrop">
                      <div className="modalBox">
                        <h3 style={{ color: "red" }}>Confirm Logout</h3>
                        <h5 style={{ color: "black" }}>
                          Are you sure you want to logout?
                        </h5>
                        <div className="modalButtons">
                          <button
                            className="btn"
                            onClick={() => {
                              handleLogout(); // ✅ logout only when confirmed
                              setShowLogoutConfirm(false);
                            }}
                          >
                            Yes
                          </button>
                          <button
                            className="btn"
                            onClick={() => setShowLogoutConfirm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="Content" style={{ marginTop: "2rem" }}>
          <h3>   <IoLibrary   size={28} color="white"/>   Last 3 Notes:</h3>
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
