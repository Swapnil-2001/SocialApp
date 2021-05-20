import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/auth";
import { useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { getBase64 } from "../../util/base64";
import { FETCH_POSTS_QUERY } from "../../util/graphql";
import gql from "graphql-tag";

function UpdateProfile(props) {
  const username = props.match.params.username;
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  if (!user || user.username !== username) {
    history.push("/");
  }
  const [values, setValues] = useState({
    username,
    id: user ? user.id : "",
    image: user ? user.image : "",
    email: user ? user.email : "",
  });
  const [updateUserFunction, { loading }] = useMutation(UPDATE_USER, {
    update() {
      logout();
      props.history.push("/login");
    },
    onError(err) {
      console.log(err);
    },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    variables: {
      ...values,
      username: values.username.toLowerCase(),
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserFunction();
  };
  const handleFileUpload = async (e) => {
    let file = e.target.files[0];
    try {
      let result = await getBase64(file);
      setValues((prev) => ({ ...prev, image: result }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form
      onSubmit={handleSubmit}
      noValidate
      className={loading ? "loading" : ""}
    >
      <input
        label="Username"
        placeholder="Username"
        name="username"
        style={{ textTransform: "lowercase" }}
        type="text"
        value={values.username}
        onChange={handleChange}
      />
      <Form.Input
        label="Email"
        placeholder="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
      />
      <input
        type="file"
        name="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleFileUpload}
      />
      <Button type="submit" primary>
        Update
      </Button>
    </Form>
  );
}

const UPDATE_USER = gql`
  mutation updateUser(
    $username: String!
    $id: ID!
    $email: String!
    $image: String!
  ) {
    updateUser(
      userInput: { username: $username, id: $id, email: $email, image: $image }
    ) {
      username
      email
      image
    }
  }
`;

export default UpdateProfile;
