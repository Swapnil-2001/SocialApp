import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";

import { FETCH_USER_QUERY } from "../util/graphql";

function FollowButton({
  currentUser: { currentUsername, currentUserId },
  otherUsername,
  text,
}) {
  const [buttonText, setButtonText] = useState(text);
  const [followUser] = useMutation(FOLLOW_USER, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_USER_QUERY,
        variables: {
          username: otherUsername,
        },
      });
      proxy.writeQuery({
        query: FETCH_USER_QUERY,
        data: {
          getUser: {
            ...data.getUser,
            followers:
              buttonText === "Unfollow"
                ? data.getUser.followers.filter(
                    (follower) => follower.username !== currentUsername
                  )
                : [
                    { id: currentUserId, username: currentUsername },
                    ...data.getUser.followers,
                  ],
          },
        },
        variables: {
          username: otherUsername,
        },
      });
    },
    onError(err) {
      return err;
    },
    variables: {
      otherUsername,
    },
  });
  const handleClick = () => {
    setButtonText(buttonText === "Follow" ? "Unfollow" : "Follow");
    followUser();
  };
  return <Button onClick={handleClick}>{buttonText}</Button>;
}

const FOLLOW_USER = gql`
  mutation followUser($otherUsername: String!) {
    followUser(otherUsername: $otherUsername) {
      id
      username
    }
  }
`;

export default FollowButton;
