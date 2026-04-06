import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import home from "../assets/mansion.png";
import note from "../assets/notes.png";
import create from "../assets/magic-wand.png";
import { FaPowerOff } from "react-icons/fa6";
import { PiUserDuotone } from "react-icons/pi";
import favorite from "../assets/favorite.png";
import recent from "../assets/history.png";
import kimple from "../assets/kimple.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch user (global)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not fetched");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.log(error);
        navigate("/auth");
      }
    };

    fetchUser();
  }, [navigate, API_URL, setUser]);

  // ✅ Logout (fixed)
  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      navigate("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="oldcontbg" style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="Header">
        <img
          className="logo"
          src={kimple}
          alt="logo"
          style={{ height: "100px", width: "100px", marginLeft: "10px" }}
        />
        <h2 className="profilefont2">Profile</h2>
      </div>

      {/* SIDEBAR */}
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
        <h3
          className="Logoutprofilefont"
          onClick={() => setShowLogoutConfirm(true)}
          style={{ color: "red" }}
        >
          <FaPowerOff /> Logout
        </h3>

        {/* ✅ MODAL */}
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
                  onClick={async () => {
                    await handleLogout(); // ✅ wait properly
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

      {/* PROFILE BODY */}
      <div className="profile-body">
        <div className="profile-body-2">
          <div className="profileForm">
            <div>
              <img
                className="profilelogo2"
                style={{ height: "100px", width: "100px" }}
                alt=""
              />
            </div>
            <div className="input-wrapper">
              <label className="floating-label">Username</label>
              <h2>{user ? user.fullName : "user"}</h2>
            </div>
            <div className="input-wrapper">
              <label className="floating-label">Email</label>
              <h2>{user ? user.email : "email"}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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

export default Profile;
