import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { Menu } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

export default function MenuExampleSecondaryPointing() {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [active, setActive] = useState(path);

  const handleItemClick = (_, { name }) => setActive(name);

  return user ? (
    <Menu pointing secondary size="massive">
      <Menu.Item name={user.username} active as={Link} to="/" />
      <Menu.Menu position="right">
        <Menu.Item
          name="logout"
          onClick={() => {
            history.push("/");
            logout();
          }}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive">
      <Menu.Item
        name="home"
        active={active === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={active === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={active === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );
}
