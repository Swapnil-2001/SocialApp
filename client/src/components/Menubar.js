import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { ReactComponent as Home } from "./images/home.svg";
import none from "./images/no.png";
import "./styles/Menubar.css";
import { AuthContext } from "../context/auth";

export default function MenuExampleSecondaryPointing({ active }) {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();

  return user ? (
    <div className="menu">
      <div>
        <Link
          style={{
            backgroundColor: active === "search" ? "#3d84b8" : "#f1f1f1",
            padding: "10px 20px",
            color: active === "search" ? "white" : "#2978b5",
            fontWeight: "500",
            borderRadius: "5px",
          }}
          to="/search"
        >
          Search Users
        </Link>
      </div>
      <div className="header">
        <Link
          style={{
            backgroundColor: active === "home" ? "#3d84b8" : "",
            borderRadius: active === "home" ? "5px" : "0",
          }}
          to="/"
        >
          <Home
            fill={active === "home" ? "white" : "#a6a9b6"}
            style={{
              margin: "-5px 0",
            }}
          />
        </Link>
        <Link to={`/user/${user.username}`}>
          <img src={user.image ? user.image : none} alt="user" />
        </Link>
      </div>
      <div
        style={{ cursor: "pointer", color: "#687980" }}
        onClick={() => {
          history.push("/");
          logout();
        }}
      >
        Logout
      </div>
    </div>
  ) : (
    <div className="header">
      <Link
        style={{
          backgroundColor: active === "home" ? "#3d84b8" : "",
          borderRadius: active === "home" ? "5px" : "0",
        }}
        to="/"
      >
        <Home
          fill={active === "home" ? "white" : "#a6a9b6"}
          style={{
            margin: "-5px 0",
          }}
        />
      </Link>
      <Link
        style={{
          color: active === "login" ? "white" : "#a6a9b6",
          backgroundColor: active === "login" ? "#3d84b8" : "",
          borderRadius: active === "login" ? "5px" : "0",
        }}
        to="/login"
      >
        <p>Login</p>
      </Link>
      <Link
        style={{
          color: active === "register" ? "white" : "#a6a9b6",
          backgroundColor: active === "register" ? "#3d84b8" : "",
          borderRadius: active === "register" ? "5px" : "0",
        }}
        to="/register"
      >
        <p>Register</p>
      </Link>
    </div>
  );
}
