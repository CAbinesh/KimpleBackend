import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilebg from "../assets/img5.jpg";
import kimple from "../assets/kimple.png";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: "", email: "" });
  const [dropdown, setDropDown] = useState(false);
const API_URL=import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error({ message: "Not fetched" });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error, { message: "Failed to try" });
        navigate("/auth");
      }
    };
    fetchUser();
  }, [navigate,API_URL]);
  const handleLogout = async () => {
    await fetch(`http://localhost:5000/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    navigate("/auth");
    alert("Logged out");
  };
  return (
    <div
      style={{
        backgroundImage: `url(${profilebg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div className="Header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            className="logo"
            src={kimple}
            alt="My App Logo"
            style={{ height: "80px", marginLeft: "10px" }}
          />
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
              <div
                className="dropdown-menu"
                style={{
                  marginTop: "0.5rem",
                }}
              >
                <p style={{ cursor: "pointer" }} onClick={handleLogout}>
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <button onClick={() => navigate("/")}>←</button>
      <div className="profile-body">
        <div className="profil-body-2">
          <form encType="multipart/form-data">
            <div className="input-wrapper">
              <label className="floating-label">Username</label>
              <input type="text" value={user.fullName} readOnly />
            </div>

            <div className="input-wrapper">
              <label className="floating-label">Email</label>
              <input type="text" value={user.email} readOnly />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
