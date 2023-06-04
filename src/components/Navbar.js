import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import logo from '../images/logo.png';
import "../css/navbar.css";

const Navbar = () => {
  const [theme, setTheme] = useState("dark-theme");
  const toggleTheme = (event) => {
    event.preventDefault();
    if (theme === "light-theme") setTheme("dark-theme");
    else setTheme("light-theme");
  };
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  return (
    <div className="nav-bar">
      <Link to="/" class="nav-title">HuggyBuddy</Link>
      <span className="dark-mode" onClick={toggleTheme}>
        {theme === "light-theme" ? (
          <p style={{ fontSize: "3rem" }}>&#127769;</p>
        ) : (
          <p
            style={{
              color: "orange",
              fontSize: "3rem",
              paddingTop: "0px",
              paddingBottom: "0px"
            }}
          >
            &#9728;&#65039;
          </p>
        )}
      </span>
    </div>
  );
};

export default Navbar;
