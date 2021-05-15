import React, { useEffect, useState } from "react";
import { Button, Icon, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

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
      <Button color="teal" onClick={handleLike}>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" onClick={handleLike} basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );
  return (
    <Button as="div" labelPosition="right">
      {likebutton}
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
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
