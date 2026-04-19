import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DOMPurify from "dompurify";
import home from "../assets/mansion.png";
import note from "../assets/notes.png";
import create from "../assets/magic-wand.png";
import recent from "../assets/history.png";
import paper from "../assets/paper.png";
import restore from "../assets/arrow.png";
import profile from "../assets/verified.png";
import kimple from "../assets/kimple.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import deletes from "../assets/delete.png";

function Trashbin() {
  const [notes, setNotes] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/notes/bin`, {
          credentials: "include",
        });
        const data = await res.json();
        setNotes(data.notes || data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBin();
  }, [API_URL]);

  const handleRestore = async (id) => {
    try {
      await fetch(`${API_URL}/api/notes/restore/${id}`, {
        method: "PUT",
        credentials: "include",
      });

      setNotes((prev) =>
        prev.filter((note) => (note.id || note._id) !== id)
      );
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

      setNotes((prev) =>
        prev.filter((note) => (note.id || note._id) !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="oldcontbg">
      <div className="Header">
        <div className="rightside">
          <h2 className="profilefont2">Trash Bin</h2>
        </div>
      </div>

      <div className="sideBar">
        <div className="headerLogodiv">
          <img className="headerLogo" src={kimple} alt="" />
        </div>

        <NavLink to="/" className="profilefont">
          <img src={home} className="icon" /> Home
        </NavLink>

        <NavLink to="/new" className="profilefont">
          <img src={create} className="icon" /> Create
        </NavLink>

        <NavLink to="/oldnotes" className="profilefont">
          <img src={note} className="icon" /> Notes
        </NavLink>

        <NavLink to="/recent" className="profilefont">
          <img src={recent} className="icon" /> Recent
        </NavLink>

        <NavLink to="/trashBin" className="profilefont">
          <img src={deletes} className="icon" /> TrashBin
          {notes.length > 0 && (
            <span className="badge">{notes.length}</span>
          )}
        </NavLink>

        <NavLink to="/profile" className="profilefont">
          <img src={profile} /> Profile
        </NavLink>
      </div>

      <div className="Content">
        <h3 style={{ color: "red", margin: "30px" }}>
          Deleted notes will appear here
        </h3>

        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h4 style={{ textAlign: "center", marginTop: "60px" }}>
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

                <div className="cardButtonRow">
                  <button
                    className="cardButton"
                    onClick={() =>
                      handleRestore(note.id || note._id)
                    }
                  >
                    <img src={restore} className="icon" /> Restore
                  </button>

                  <button
                    className="cardButton danger"
                    style={{color:"red"}}
                    onClick={() =>
                      handleDeletePermanent(note.id || note._id)
                    }
                  >
                    <img src={paper} className="icon" /> Delete Permanent
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ Footer restored */}
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