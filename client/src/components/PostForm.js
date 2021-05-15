import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [values, setValues] = useState({ body: "" });
  const handleChange = (e) => setValues({ body: e.target.value });
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
      values.body = "";
    },
    onError(err) {
      return err;
    },
    variables: values,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    addPost();
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <h2>Create a post!</h2>
        <Form.Field>
          <Form.Input
            placeholder="Write a post!"
            onChange={handleChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Create
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
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
