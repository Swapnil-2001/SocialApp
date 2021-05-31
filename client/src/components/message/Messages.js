import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

import "../styles/Messages.css";
import { AuthContext } from "../../context/auth";

function Messages({ selected }) {
  const { user } = useContext(AuthContext);
  const { loading, data: { getMessages: messages } = {} } = useQuery(
    FETCH_MESSAGES_QUERY,
    {
      onError(err) {
        console.log(err);
      },
      variables: {
        username: selected,
      },
    }
  );
  return (
    <>
      {loading ? (
        <h1>Loading chats...</h1>
      ) : (
        messages &&
        messages.map((message) => (
          <div
            key={message._id}
            className={message.from === selected ? "other" : "me"}
          >
            {message.body}
          </div>
        ))
      )}
    </>
  );
}

const FETCH_MESSAGES_QUERY = gql`
  query getMessages($username: String!) {
    getMessages(username: $username) {
      body
      from
      to
    }
  }
`;

export default Messages;
