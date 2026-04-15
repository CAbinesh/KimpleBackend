import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import thandel from "../assets/Thandel.png";
import dc from "../assets/Preview.png";
import explore from "../assets/explore.png";
import insta from "../assets/instagram.png";
import linkedin from "../assets/linkedin.png";
import whatsapp from "../assets/whatsapp.png";
function Explore() {
  const navigate = useNavigate();
  return (
    <div className="explore">
        <button className="navBtnZ" onClick={() => navigate("/")}>
          ⬅ Back
        </button>
      <div className="expTitle">
        <img src={explore} alt="My Image" />
      </div>
      <div className="card">
        <div className="bg">
          {" "}
          <a
            href="https://eveningcollectionfront.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={dc} alt="My Image" title="eveningcollection" />
          </a>
        </div>
        <div className="blob"></div>
      </div>

      <div className="card">
        <div className="bg">
          <a
            href="https://thandalfront.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={thandel} alt="My Image" title="thandal" />
          </a>
        </div>{" "}
        <div className="blob2"></div>
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

export default Explore;
