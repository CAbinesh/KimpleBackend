import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import JoditEditor from "jodit-react";
import kimple from "../assets/kimple.png";
import { IoHome } from "react-icons/io5";
import { PiCards } from "react-icons/pi";
import { IoCreate } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegSave } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

function New() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [count, setCount] = useState(0);
  const [lastSaved, setLastSaved] = useState("");
  const [currentNote, setCurrentNote] = useState(null);
  const editor = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;

  const noteToEdit = currentNote || location.state?.note || null;

  // ✅ fetch trash count properly
  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notes/bin/count`, {
        credentials: "include",
      });
      const data = await res.json();
      setCount(data.count);
    } catch (err) {
      console.log(err);
    }
  }, [API_URL]);

  // ✅ run only once
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Load existing note
  useEffect(() => {
    if (noteToEdit) {setContent(noteToEdit.content);setLastSaved(noteToEdit.content)};
  }, [noteToEdit]);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing your note...",
    }),
    [],
  );

  const isChanged = content !== lastSaved;

  const handleSave = async () => {
    if (!content.trim()) return toast.warning("Note is empty!");
    if (!isChanged) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      const data = await res.json();
      setCurrentNote(data);
      setLastSaved(content);

      setLastSaved(content);
      toast.success("Note saved!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (silent = false) => {
    if (!noteToEdit || !content.trim())
      return toast.warning("No changes done!");
    try {
      await fetch(`${API_URL}/api/notes/${noteToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      if (!silent) toast.success("Note updated!");
    } catch (err) {
      console.log(err);
      if (!silent) toast.error("Failed to update note.");
    }
  };

  // ✅ FIXED DELETE
  const handleDelete = async () => {
    if (!noteToEdit) return;

    try {
      const res = await fetch(`${API_URL}/api/notes/delete/${noteToEdit.id}`, {
        method: "PUT",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Move to bin failed");

      toast.success("Moved to trash");

      // 🔥 update count instantly
      await fetchCount();

      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete note.");
    }
  };

  return (
    <div className="oldcontbg2">
      <div className="Header">
        <h2 className="profilefont2">
          {noteToEdit ? "Edit Note" : "New Note"}
        </h2>
      </div>

      <div className="sideBar">
        <div className="headerLogodiv">
          <img className="headerLogo" src={kimple} alt="" />
        </div>

        <div className="navLink">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <IoHome className="icon" /> Home
          </NavLink>

          <NavLink
            to="/new"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <IoCreate className="icon" /> Create
          </NavLink>

          <NavLink
            to="/oldnotes"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <PiCards className="icon" /> Notes
          </NavLink>

          <NavLink
            to="/recent"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <FaClockRotateLeft className="icon" /> Recent
          </NavLink>

          <NavLink
            to="/trashBin"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <FaRegTrashAlt className="icon" /> TrashBin
            {count > 0 && <span className="badge">{count}</span>}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "profilefont active" : "profilefont"
            }
          >
            <FaRegUserCircle className="icon" /> Profile
          </NavLink>
        </div>
      </div>

      <div className="Content" style={{ marginTop: "1rem" }}>
        <button className="navBtn" onClick={() => navigate("/")}>
          <IoMdArrowRoundBack className="icon" />
        </button>

        {noteToEdit ? (
          <button
            title="Update"
            className="savebtn"
            onClick={() => handleUpdate(false)}
            disabled={isSaving}
          >
            Update <CiEdit className="icon" />
          </button>
        ) : (
          <button
            title="Save"
            className="savebtn"
            onClick={handleSave}
            disabled={!isChanged || isSaving}
          >
            Save <FaRegSave className="icon" />
          </button>
        )}

        {noteToEdit && (
          <button title="Delete" className="dltbtn" onClick={handleDelete}>
            Delete <FaRegTrashAlt className="icon" />
          </button>
        )}
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onChange={(newContent) => setContent(newContent)}
        />
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

export default New;
