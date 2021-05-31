import React, { useState } from "react";
import { Button, Form, Container } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import Menubar from "../Menubar";
import "../styles/Register.css";
import { getBase64 } from "../../util/base64";
import { useAuthDispatch } from "../../context/auth";

function Register(props) {
  const dispatch = useAuthDispatch();
  const [errors, setErrors] = useState({});
  const [values, setvalues] = useState({
    image: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    const { value, name } = e.target;
    setvalues({ ...values, [name]: value });
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      dispatch({ type: "LOGIN", payload: userData });
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
    addUser();
  };

  const handleFileUpload = async (e) => {
    let file = e.target.files[0];
    try {
      let result = await getBase64(file);
      setvalues({ ...values, image: result });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Menubar active="register" />
      <Container>
        <Form
          onSubmit={handleSubmit}
          noValidate
          className={loading ? "loading" : ""}
        >
          <h1
            style={{ marginTop: "30px", color: "#3d84b8", textAlign: "center" }}
          >
            Register
          </h1>
          <h4>Username</h4>
          <input
            placeholder="Username"
            name="username"
            style={{
              textTransform: "lowercase",
              outline: errors.username ? "1px solid red" : "none",
              background: errors.username ? "pink" : "none",
            }}
            type="text"
            value={values.username}
            onChange={handleChange}
          />
          <h4>Profile Picture</h4>
          <input
            type="file"
            name="file"
            className="file-input"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
          <h4>Email Address</h4>
          <Form.Input
            placeholder="Email"
            name="email"
            type="email"
            error={errors.email ? true : false}
            value={values.email}
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
          <h4>Confirm Password</h4>
          <Form.Input
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            error={errors.confirmPassword ? true : false}
            value={values.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit" primary>
            Register
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

const REGISTER_USER = gql`
  mutation register(
    $image: String!
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        image: $image
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      image
      id
      email
      username
      createdAt
      token
      chats
    }
  }
`;

export default Register;
