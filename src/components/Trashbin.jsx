import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DOMPurify from "dompurify";
import { MdBrokenImage } from "react-icons/md";
import { MdRestorePage } from "react-icons/md";
import kimple from "../assets/kimple.png";
import { GiSparkles } from "react-icons/gi";
import { FaRegUserCircle } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { PiCards } from "react-icons/pi";
import { IoCreate } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";

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

      setNotes((prev) => prev.filter((note) => (note.id || note._id) !== id));
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

      setNotes((prev) => prev.filter((note) => (note.id || note._id) !== id));
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

          <NavLink to="/trashBin" className="profilefont">
            <FaRegTrashAlt className="icon" /> TrashBin
            {notes.length > 0 && <span className="badge">{notes.length}</span>}
          </NavLink>

          <NavLink to="/profile" className="profilefont">
            <FaRegUserCircle alt="profile" className="icon" /> Profile
          </NavLink>
        </div>
      </div>

      <div className="Content">
        <h3 style={{ color: "red", margin: "30px" }}>
          Deleted notes will appear here
        </h3>

        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "60px",
                color: "white",
              }}
            >
              <span>Your Trash Is Empty</span>
              <GiSparkles style={{ fontSize: "25px",color:"yellow" }} />
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
                    onClick={() => handleRestore(note.id || note._id)}
                  >
                    <MdRestorePage className="icon" /> Restore
                  </button>

                  <button
                    className="cardButton danger"
                    style={{ color: "red" }}
                    onClick={() => handleDeletePermanent(note.id || note._id)}
                  >
                    <MdBrokenImage className="icon" /> Delete Permanent
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
