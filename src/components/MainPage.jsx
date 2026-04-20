import React, { useEffect, useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
import { GiGears } from "react-icons/gi";
import { MdOutlineExplore } from "react-icons/md";
import kimple from "../assets/kimple.png";
import { IoHome } from "react-icons/io5";
import { PiCards } from "react-icons/pi";
import { IoCreate } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import { FaRegTrashAlt } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

function MainPage() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [user, setUserData] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdown, setDropDown] = useState(false);
  const [count, setCount] = useState(0);
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
  const fetchCount = async () => {
    const res = await fetch(`${API_URL}/api/notes/bin/count`, {
      credentials: "include",
    });
    const data = await res.json();
    setCount(data.count);
  };
  fetchCount();
  const latest = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/delete/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Move to bin failed");
      setNotes((prev) => prev.filter((note) => note.id !== id));
      fetchCount();
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
        <div className="rightside" style={{ color: "white" }}>
          <div className="rightsidesvg">
            <button onClick={() => navigate("/explore")}>
              <MdOutlineExplore
                title="Explore"
                alt="explore"
                className="icon"
              />{" "}
              Explore
            </button>
          </div>
          <div className="rightsidesvg">
            <button>
              <GiGears title="settings" alt="settings" className="icon" />{" "}
              Settings
            </button>
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
        <div className="headerLogodiv">
          <img className="headerLogo" src={kimple} alt="" />
        </div>
        <div className="navLink">
          <NavLink
            style={{ cursor: "pointer" }}
            to="/"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            {" "}
            <IoHome className="icon" /> Home
          </NavLink>

          <NavLink
            style={{ cursor: "pointer" }}
            to="/new"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <IoCreate className="icon" /> Create
          </NavLink>
          <NavLink
            style={{ cursor: "pointer" }}
            to="/oldnotes"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <PiCards className="icon" /> Notes
          </NavLink>

          <NavLink
            style={{ cursor: "pointer" }}
            to="/recent"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <FaClockRotateLeft className="icon" /> Recent
          </NavLink>
          <NavLink
            style={{ cursor: "pointer" }}
            to="/trashBin"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <FaRegTrashAlt className="icon" /> TrashBin
            {count > 0 && <span className="badge">{count}</span>}
          </NavLink>
        </div>
      </div>
      {/* greet box */}
      <div className="greetBox">
        <h1>
          <span className="welcome-text">Welcome, </span>
          <span className="user-name">{user ? user.fullName : "user"}</span>
          <span className="exclamation"> !</span>
        </h1>
        <div className="centreline"></div>
        <h3>Capture your thoughts efficiently</h3>
      </div>
      {/* greetbox👆 */}
      <div className="Content" style={{ marginTop: "2rem" }}>
        <h3 style={{ color: "white",margin:"12px" }}> Recent Notes:</h3>
        <div
          className="Content-container"
          style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
        >
          {latest.length === 0 ? (
            <h4 style={{ color: "white",marginLeft:"12px" }}>
              {" "}
              Nothing here yet — create your first note ✨
            </h4>
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

                <div className="cardButtonRow">
                  <button
                    className="cardButton"
                    style={{ color: "white" }}
                    onClick={() => handleEdit(note)}
                  >
                    <CiEdit className="icon" /> Edit
                  </button>
                  <button
                    className="cardButton"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(note.id)}
                  >
                    <FaRegTrashAlt className="icon" /> Move to Bin
                  </button>
                </div>
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
