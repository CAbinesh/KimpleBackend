import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DOMPurify from "dompurify";
import home from "../assets/mansion.png";
import note from "../assets/notes.png";
import create from "../assets/magic-wand.png";
import favorite from "../assets/favorite.png";
import recent from "../assets/history.png";
import paper from "../assets/paper.png";
import restore from "../assets/arrow.png";
import profile from "../assets/verified.png";
import kimple from "../assets/kimple.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
function Trashbin() {
  const [notes, setNotes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchBin = async () => {
    const res = await fetch(`${API_URL}/api/notes/bin`, {
      credentials: "include",
    });
    const data = await res.json();
    setNotes(data);
  };
  fetchBin();
  useEffect(() => {}, [API_URL]);
  const handleRestore = async (id) => {
    try {
      await fetch(`${API_URL}/api/notes/restore/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      fetchBin();
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeletePermanent = async (id) => {
    try {
      await fetch(`${API_URL}/api/notes/permanent/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchBin();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="oldcontbg">
      <div className="Header">
        <img className="headerLogo" src={kimple} alt="" />
        <div className="rightside">
          <h2 className="profilefont2">Trash Bin</h2>
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
        <NavLink
          style={{ cursor: "pointer" }}
          to="/profile"
          className={({ isActive }) =>
            isActive ? "profilefont active" : "profilefont"
          }
        >
          {" "}
          <img src={profile} alt="profile" />
          Profile{" "}
        </NavLink>
      </div>
      <div className="Content">
        <h3
          style={{
            textDecoration: "underline",
            color: "red",
            opacity: 0.7,
            fontWeight: "900",
            fontSize: "20px",
            margin: "30px",
          }}
        >
          Deleted notes will appear here
        </h3>
        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h4
              style={{
                textAlign: "center",
                marginTop: "60px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Your trash is empty 🗑
            </h4>
          ) : (
            notes.map((note) => (
              <div key={note.id || note._id} className="note-card">
                <div
                  className="note-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.content),
                  }}
                />

                <button
                  className="cardButton"
                  onClick={() => handleRestore(note.id || note._id)}
                >
                  <img src={restore} alt="favorite" className="icon" /> Restore
                </button>

                <button
                  className="cardButton"
                  style={{ color: "red" }}
                  onClick={() => handleDeletePermanent(note.id || note._id)}
                >
                  <img src={paper} alt="favorite" className="icon" /> Delete
                  Permanent
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

export default Trashbin;
