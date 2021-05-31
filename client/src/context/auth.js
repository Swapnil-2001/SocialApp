import React, { useReducer, createContext, useContext } from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
  } else {
    user = JSON.parse(localStorage.getItem("user"));
  }
}

function authReducer(state = {}, action) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("jwtToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
