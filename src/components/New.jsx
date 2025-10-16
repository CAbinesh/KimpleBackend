import React, { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import img001 from "../assets/img001.jpg";
import JoditEditor from "jodit-react";
import kimple from '../assets/kimple.png'

function New() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editor = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
const API_URL = import.meta.env.VITE_API_URL;
  const noteToEdit = location.state?.note || null;

  // Load existing note content
  useEffect(() => {
    if (noteToEdit) setContent(noteToEdit.content);
  }, [noteToEdit]);

  // Editor config
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing your note...",
    }),
    []
  );

 
  const handleSave = async () => {
    if (!content.trim()) return alert("Note is empty!");
    setIsSaving(true);
    try {
      await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      alert("Note saved!");
      navigate("/");
    } catch (err) {
      alert(err, "Failed to save note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (silent = false) => {
    if (!noteToEdit || !content.trim()) return;
    try {
      await fetch(`${API_URL}/api/notes/${noteToEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      if (!silent) alert("Note updated!");
    } catch (err) {
      if (!silent) alert(err, "Failed to update note.");
    }
  };

  const handleDelete = async () => {
    if (!noteToEdit) return;
    try {
      await fetch(`${API_URL}/api/notes/${noteToEdit.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      navigate("/");
    } catch (err) {
      alert(err, "Failed to delete note.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${img001})`,
        backgroundSize:'cover',
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div className="Title">
        
      </div>

      <div
        className="Header2"
        style={{
          maxWidth: "500px",
          margin: "1rem auto",
          justifyContent:'space-between',
          display: "flex",
        }}
      >
        <div style={{ display: "flex" }}>
                <img className="logo"
                  src={kimple} 
                  alt="My App Logo" 
                  style={{ height: "80px", marginLeft: "10px", }}
                /></div>
        <h2 className="profilefont"style={{marginRight:'200px'}}>{noteToEdit ? "Edit Note" : "New Note"}</h2>
      </div>

      <div className="NewHeader">
        <button onClick={() => navigate("/")}>←</button>
        {noteToEdit ? (
          <button
            title="Update"
            className="savebtn"
            onClick={() => handleUpdate(false)}
            disabled={isSaving}
          >
            Update ✏️
          </button>
        ) : (
          <button
            title="Save"
            className="savebtn"
            onClick={handleSave}
            disabled={isSaving}
          >
            Save ✅
          </button>
        )}
        {noteToEdit && (
          <button title="Delete" className="dltbtn" onClick={handleDelete}>
            Delete ❌
          </button>
        )}
      </div>

      <div className="editor-container" style={{ marginTop: "1rem" }}>
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onBlur={(newContent) => setContent(newContent)}
        />
      </div>

      {/* Render saved content with formatting (instead of raw <p> tags) */}
      

      <div className="Footer" style={{ marginTop: "2rem", textAlign: "center" }}>
        <h5>©2025 All Rights Reserved</h5>
      </div>
    </div>
  );
}

export default New;
