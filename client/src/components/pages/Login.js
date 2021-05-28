import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import Menubar from "../Menubar";
import "../styles/Login.css";
import { AuthContext } from "../../context/auth";
import loginImg from "../images/chat.png";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setvalues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setvalues({ ...values, [name]: value });
  };

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      context.login(userData);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      ...values,
      username: values.username.toLowerCase(),
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <>
      <Menubar active="login" />
      <div className="login__wrapper">
        <div>
          <img src={loginImg} alt="login" />
        </div>
        <div>
          <Form
            onSubmit={handleSubmit}
            noValidate
            className={loading ? "loading" : ""}
          >
            <h4>Username</h4>
            <input
              placeholder="Username"
              name="username"
              style={{
                textTransform: "lowercase",
                outline: errors.username ? "1px solid red" : "none",
                background: errors.username ? "#f6dfeb" : "#f1f1f1",
                border: "none",
              }}
              type="text"
              value={values.username}
              onChange={handleChange}
            />
            <h4>Password</h4>
            <input
              placeholder="password"
              name="password"
              type="password"
              style={{
                outline: errors.password ? "1px solid red" : "none",
                background: errors.password ? "#f6dfeb" : "#f1f1f1",
                border: "none",
                marginBottom: "25px",
              }}
              value={values.password}
              onChange={handleChange}
            />
            <Button type="submit" primary>
              Login
            </Button>
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      image
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
