import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { getBase64 } from "../../util/base64";

import { AuthContext } from "../../context/auth";

function Register(props) {
  const context = useContext(AuthContext);
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
    setvalues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
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
    addUser();
  };

  const handleFileUpload = async (e) => {
    let file = e.target.files[0];
    try {
      let result = await getBase64(file);
      setvalues((prev) => ({ ...prev, image: result }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        noValidate
        className={loading ? "loading" : ""}
      >
        <h1>Register</h1>
        <input
          label="Username"
          placeholder="Username"
          name="username"
          style={{ textTransform: "lowercase" }}
          type="text"
          value={values.username}
          onChange={handleChange}
        />
        <input
          type="file"
          name="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileUpload}
        />
        <Form.Input
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          error={errors.email ? true : false}
          value={values.email}
          onChange={handleChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          error={errors.password ? true : false}
          value={values.password}
          onChange={handleChange}
        />
        <Form.Input
          label="Confirm Password"
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
    </div>
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
    }
  }
`;

export default Register;
