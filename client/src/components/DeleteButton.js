import React, { useState } from "react";
import { Button, Confirm, Icon } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { FETCH_POSTS_QUERY } from "../util/graphql";

function DeleteButton({ id, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePost] = useMutation(DELETE_POST, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: data.getPosts.filter((post) => post.id !== id),
        },
      });
      if (callback) callback();
    },
    variables: {
      postId: id,
    },
  });
  return (
    <>
      <Button
        as="div"
        floated="right"
        color="red"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: "0" }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
