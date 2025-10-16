import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profilebg from "../assets/img003.jpg";
import kimple from "../assets/kimple.png";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: "", email: "" });
  // const [dropdown, setDropDown] = useState(false);
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
  //  const handleLogout = async () => {
  //   await fetch(`${API_URL}/api/logout`, {
  //     method: "POST",
  //     credentials: "include",
  //   });
  //   setUser(null);
  //   navigate('/auth')
  //   alert("Logged out");
  // };

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
            style={{ height: "100px",width:'100px', marginLeft: "10px" }}
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
          {/* <div className="dropdown">
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
          </div> */}
        </div>
      </div>
<div
        className="smallHeader"
        style={{
          maxWidth: "500px",
          margin: "1rem auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // center children
          background: "white",
          padding: "16px 16px",
          borderRadius: "12px",
          position: "relative", // allows absolute positioning for button
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute",
            left: "16px", // stick to left edge
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
          }}
        >
          ←
        </button>

        <h2 className="profilefont" style={{ margin: 0 }}>
          Profile
        </h2>
      </div>      <div className="profile-body">
        <div className="profile-body-2">
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
