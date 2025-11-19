import React, { useState } from "react";
import "./JoinGroup.css";
import Register from "../Register/Register";
import Login from "../Login/Login";
import logo from "../../assets/Picture1.png";
import wallpaper from "../../assets/walpepa.jpeg";

const JoinGroup = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="join-group-page">
      <div
        className="background-image"
        style={{ backgroundImage: `url(${wallpaper})` }}
      ></div>

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h2>ChamaPro</h2>
          <img src={logo} alt="Logo" className="logo-extending" />
        </div>
        <div className="nav-right">
          <a href="#contact">Contact</a>
          <a href="#learn-more">Learn More</a>
        </div>
      </nav>

      {/* Left Section */}
      <div className="left-section">
        <h1 className="welcome-title">Welcome to Chama Empowerment</h1>
        <p className="welcome-text">
          <strong>Chama Empowerment</strong> helps groups save, invest, and
          grow together. Manage your chama transparently — from contributions
          and loans to dividends and financial tracking.
        </p>
        <p className="welcome-text">
          Join thousands of active members who are already taking control of
          their financial future — safely and collaboratively.
        </p>
        <a href="#learn-more" className="learn-more-btn">
          Learn More
        </a>
      </div>
      <form className="form-container">
        {showLogin ? (
          <Login onToggleAuth={() => setShowLogin(false)} />
        ) : (
          <Register onToggleAuth={() => setShowLogin(true)} hideFooter />
        )}

      </form>

      <footer id="contact">
        <p>📩 Contact us at: support@chamapro.com</p>
        <p>© {new Date().getFullYear()} ChamaPro — All rights reserved.</p>
      </footer>
    </div>
  );
};

export default JoinGroup;
