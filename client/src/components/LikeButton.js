import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { ReactComponent as Like } from "./heart.svg";
import "./styles/Like.css";

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);
  const [likePost] = useMutation(LIKE_POST, {
    onError(err) {
      return err;
    },
    variables: { postId: id },
  });
  const handleLike = () => likePost();
  const likebutton = user ? (
    liked ? (
      <div style={{ width: "25px" }} onClick={handleLike}>
        <Like fill="red" />
      </div>
    ) : (
      <div style={{ width: "25px" }} onClick={handleLike}>
        <Like />
      </div>
    )
  ) : (
    <div style={{ width: "25px" }}>
      <Link to="/login">
        <Like />
      </Link>
    </div>
  );
  return (
    <div className="like__div">
      {likebutton}
      {likeCount}
    </div>
  );
}

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
        createdAt
      }
      likeCount
    }
  }
`;

export default LikeButton;
