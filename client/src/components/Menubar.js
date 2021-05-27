import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { ReactComponent as Home } from "./images/home.svg";
import none from "./images/no.png";
import "./styles/Menubar.css";
import { AuthContext } from "../context/auth";

export default function MenuExampleSecondaryPointing() {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const pathname = window.location.pathname;
  const active = pathname === "/" ? "home" : pathname.substr(1);

  return user ? (
    <div className="menu">
      <Link to="/">
        <Home fill={active === "home" ? "#3d84b8" : ""} />
      </Link>
      <div>
        <Link to={`/user/${user.username}`}>
          <img src={user.image ? user.image : none} alt="user" />
        </Link>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.push("/");
            logout();
          }}
        >
          Logout
        </div>
      </div>
    </div>
  ) : (
    <div className="menu">
      <Link to="/">
        <Home fill={active === "home" ? "#3d84b8" : ""} />
      </Link>
      <div>
        <Link
          style={{ color: active === "login" ? "#3d84b8" : "black" }}
          to="/login"
        >
          <p>Login</p>
        </Link>
        <Link
          style={{ color: active === "register" ? "#3d84b8" : "black" }}
          to="/register"
        >
          <p>Register</p>
        </Link>
      </div>
    </div>
  );
}
