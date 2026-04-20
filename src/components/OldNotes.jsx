import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import DOMPurify from "dompurify";
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
import dashboard from "../assets/dashboard.png";
import { FaRegUserCircle } from "react-icons/fa";

function OldNotes() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
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
  const fetchCount = async () => {
    const res = await fetch(`${API_URL}/api/notes/bin/count`, {
      credentials: "include",
    });
    const data = await res.json();
    setCount(data.count);
  };
  fetchCount();
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/notes/delete/${id}`, {
        method: "PUT",
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
    return firstLine.length > 20 ? firstLine.slice(0, 20) + "..." : firstLine;
  };

  const handleEdit = (note) => navigate("/new", { state: { note } });

  return (
    <div className="oldcontbg">
      <div className="Header">
        <div className="rightside">
          <h2 className="profilefont2">All Notes</h2>
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
          <NavLink
            style={{ cursor: "pointer" }}
            to="/profile"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            {" "}
            <FaRegUserCircle alt="profile" className="icon" /> Profile
          </NavLink>
        </div>
      </div>

      <div className="Content">
        <h3
          style={{
            fontWeight: "900",
            fontSize: "24px",
            color: "white",
          }}
        >
          <img src={dashboard} alt="create" className="contenticon" /> Notes
          Dashboard
        </h3>
        <div className="OldNotes-container">
          {notes.length === 0 ? (
            <h4
              style={{
                textAlign: "center",
                marginTop: "60px",
                fontWeight: "500",
                marginBottom: "8px",
                color:"white"
              }}
            >
              No Data found ＞︿＜
            </h4>
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
                <div className="cardButtonRow">
                  <button
                    className="cardButton"
                    onClick={() => handleEdit(note)}
                  >
                    Edit{" "}
                    <CiEdit className="icon" alt="favorite" className="icon" />
                  </button>
                  <button
                    className="cardButton"
                    style={{ color: "red" }}
                    onClick={() => handleDelete(note.id)}
                  >
                    Move to Bin{" "}
                    <FaRegTrashAlt alt="favorite" className="icon" />{" "}
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

export default OldNotes;
