import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoLibrary } from "react-icons/io5";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
import home from "../assets/mansion.png";
import note from "../assets/notes.png";
import create from "../assets/magic-wand.png";
import favorite from "../assets/favorite.png";
import recent from "../assets/history.png";
import { PiUserDuotone } from "react-icons/pi";
import kimple from "../assets/kimple.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";

function OldNotes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
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
  const getTitle = (content) => {
    if (!content) return "untitled";
    const text = content.replace(/<[^>]+>/g, "").trim();
    const firstLine = text.split("\n")[0];
    return firstLine.length > 40 ? firstLine.slice(0, 40) + "..." : firstLine;
  };

  const handleEdit = (note) => navigate("/new", { state: { note } });

  return (
    <div className="oldcontbg">
      <div className="Header">
        <img className="headerLogo" src={kimple} alt="" />
        <div className="rightside">
          <h2 className="profilefont2">All Notes</h2>
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
          <PiUserDuotone /> Profile{" "}
        </NavLink>
      </div>

      <div className="Content">
        <h3
          style={{
            color: "white",
            fontFamily: "cursive",
            fontWeight: "900",
            fontSize: "24px",
          }}
        >
          <IoLibrary size={28} color="white" /> All Notes:
        </h3>
        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h2 style={{ color: "white" }}>No Data found.</h2>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="notecardTitle">
                  <h3>{getTitle(note.content)}</h3>
                  <small>
                    {new Date(note.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </small>
                </div>
                {/* ✅ render formatted HTML */}
                <div
                  className="note-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.content),
                  }}
                />
                <button className="cardButton" onClick={() => handleEdit(note)}>✏️ Edit</button>
                <button className="cardButton" style={{color:"red"}} onClick={() => handleDelete(note.id)}>❌ Delete</button>
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

export default OldNotes;
