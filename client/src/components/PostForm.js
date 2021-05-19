import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import "./styles/PostForm.css";

import { getBase64 } from "../util/base64";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [values, setValues] = useState({ body: "", image: "" });
  const [addPost, { error }] = useMutation(CREATE_POST, {
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
    },
    onError(err) {
      return err;
    },
    variables: values,
  });
  const handleFileUpload = async (e) => {
    let file = e.target.files[0];
    try {
      let result = await getBase64(file);
      setValues((prev) => ({ ...prev, image: result }));
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost();
    setValues({ body: "", image: "" });
  };
  error && console.log(error);
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Create a post!</h2>
        <Form.Field>
          <Form.Input
            placeholder="Write a post!"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, body: e.target.value }))
            }
            value={values.body}
            error={error ? true : false}
          />
          <input
            type="file"
            name="file"
            accept=".jpg,.jpeg,.png"
            className="custom-file-input"
            onChange={handleFileUpload}
          />
          <Button type="submit" color="teal">
            Create
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0]}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!, $image: String!) {
    createPost(body: $body, image: $image) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;

export default PostForm;
