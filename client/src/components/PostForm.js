import React, { useState, useEffect } from "react";
import { Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import "./styles/PostForm.css";
import check from "./images/check.png";
import image from "./images/image.png";
import { getBase64 } from "../util/base64";
import { FETCH_POSTS_QUERY } from "../util/graphql";

function PostForm() {
  const [values, setValues] = useState({ body: "", image: "" });
  const [uploaded, setUploaded] = useState(false);
  useEffect(() => {
    if (values.image !== "") {
      setUploaded(true);
    }
  }, [values]);
  const [addPost] = useMutation(CREATE_POST, {
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
    setUploaded(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="post__input">
          <textarea
            placeholder="What's on your mind?"
            onChange={(e) =>
              setValues((prev) => ({ ...prev, body: e.target.value }))
            }
            value={values.body}
          />
          <label htmlFor="myInput">
            <img
              src={image}
              alt="upload"
              style={{ width: "30px", cursor: "pointer" }}
            />
          </label>
          {uploaded && (
            <img
              src={check}
              alt="success"
              style={{ width: "25px", margin: "10px" }}
            />
          )}
        </div>
        <input
          type="file"
          name="file"
          id="myInput"
          style={{ display: "none" }}
          accept=".jpg,.jpeg,.png"
          onChange={handleFileUpload}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="submit" color="blue">
            Create
          </Button>
        </div>
      </form>
    </div>
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
