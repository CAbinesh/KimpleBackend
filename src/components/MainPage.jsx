import React, { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";

import { GrSettingsOption } from "react-icons/gr";
import { HiOutlineSparkles } from "react-icons/hi2";
import kimple from "../assets/kimple.png";
import home from "../assets/mansion.png";
import note from "../assets/notes.png";
import create from "../assets/magic-wand.png";
import favorite from "../assets/favorite.png";
import recent from "../assets/history.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
function MainPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [user, setUserData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropDown] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const userRes = await fetch(`${API_URL}/api/me`, {
          credentials: "include",
        });
        if (!userRes.ok) {
          navigate("/auth");
          return;
        }
        const UserData = await userRes.json();
        setUserData(UserData);
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

  const latest = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
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
    <div className="MainPgContainer1">
      <div className="Header">
        <div>
          <img className="headerLogo" src={kimple} alt="" />
        </div>
        <div className="rightside">
          <div className="rightsidesvg">
            <HiOutlineSparkles />
          </div>
          <div className="rightsidesvg">
            <GrSettingsOption />{" "}
          </div>
          <div className="dropdown">
            <div className="dropdownArea">
              <div
                className="profilelogo1"
                onClick={() => setDropDown(!dropdown)}
                style={{ cursor: "pointer" }}
              ></div>
            </div>

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
                  style={{ cursor: "pointer", color: "red" }}
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
      <div className="sideBar">
        <NavLink
          style={{ cursor: "pointer" }}
          to="/"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          {" "}
          <img src={home} alt="home" className="icon" /> Home
        </NavLink>

        <NavLink
          style={{ cursor: "pointer" }}
          to="/new"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          <img src={create} alt="create" className="icon" /> Create
        </NavLink>
        <NavLink
          style={{ cursor: "pointer" }}
          to="/oldnotes"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          <img src={note} alt="create" className="icon" /> Notes
        </NavLink>

        <NavLink
          style={{ cursor: "pointer" }}
          to="/recent"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          <img src={recent} alt="recent" className="icon" /> Recent
        </NavLink>
        <NavLink
          style={{ cursor: "pointer" }}
          to="/recent"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          <img src={favorite} alt="favorite" className="icon" /> Favorite
        </NavLink>
      </div>
      {/* greet box */}
      <div className="greetBox">
        <h1>Welcome, {user ? user.fullName : "user"} !</h1>
        <div className="centreline"></div>
        <h3>Capture your thoughts efficiently</h3>
      </div>
      {/* greetbox👆 */}
      <div className="Content" style={{ marginTop: "2rem" }}>
        <h3> Recent Notes:</h3>
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

      <div className="footer">
        <div className="footerCentreline"></div>
        <h5>©2025 All Rights Reserved</h5>
        <div className="footer2">
          <p>😊 About Us</p>
          <p>📞 Contact</p>
          <p>🫂 Support</p>
        </div>
        <div className="footer3">
          <img src={whatsapp} alt="whatsapp" />
          <img src={linkedin} alt="linkedin" />
          <img src={insta} alt="instagram" />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
