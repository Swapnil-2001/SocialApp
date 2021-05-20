import React, { useContext, useState } from "react";
import { Button, Form, Container } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import Menubar from "../Menubar";
import { AuthContext } from "../../context/auth";

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [values, setvalues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      <Menubar />
      <Container>
        <Form
          onSubmit={handleSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <h1
            style={{ marginTop: "30px", color: "#3d84b8", textAlign: "center" }}
          >
            Login
          </h1>
          <h4>Username</h4>
          <input
            label="Username"
            placeholder="Username"
            name="username"
            style={{ textTransform: "lowercase" }}
            type="text"
            value={values.username}
            onChange={handleChange}
          />
          <h4>Password</h4>
          <Form.Input
            placeholder="Password"
            name="password"
            type="password"
            error={errors.password ? true : false}
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
      </Container>
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
