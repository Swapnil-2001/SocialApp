import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuthState } from "../context/auth";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useAuthState();
  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  );
};

export default AuthRoute;
