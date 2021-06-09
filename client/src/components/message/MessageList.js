import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { useMessageState, useMessageDispatch } from "../../context/message";
import "../styles/Messages.css";

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

function Messages({ selectedUser }) {
  const dispatch = useMessageDispatch();
  useEffect(() => {
    dispatch({ type: "SET_SELECTED_USER", payload: selectedUser });
  }, [dispatch, selectedUser]);
  const { users } = useMessageState();
  const [body, setBody] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    variables: {
      body,
      to: selectedUser,
    },
  });
  const { loading, data: { getMessages } = {} } = useQuery(
    FETCH_MESSAGES_QUERY,
    {
      onError: (err) => console.log(err),
      variables: {
        username: selectedUser,
      },
    }
  );
  useEffect(() => {
    const userIndex = users.findIndex((u) => u.username === selectedUser);
    if (userIndex === -1) return;
    if (!users[userIndex].messages && getMessages) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser,
          messages: getMessages,
        },
      });
    }
  }, [users, getMessages, dispatch, selectedUser]);
  const selected = users?.find((u) => u.selected === true);
  const messages = selected?.messages;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (body.trim() === "") return;
    setBody("");
    sendMessage();
  };
  return (
    <>
      {loading ? (
        <h1>Loading chats...</h1>
      ) : (
        <div className="message__box">
          <header>{selectedUser}</header>
          <div style={{ paddingTop: "10px" }}>
            {messages &&
              messages.map((message) => (
                <div
                  key={message.id}
                  className={message.from === selectedUser ? "other" : "me"}
                >
                  {message.body}
                </div>
              ))}
            <AlwaysScrollToBottom />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="message__input">
              <input
                value={body}
                placeholder="Type a message"
                onChange={(e) => setBody(e.target.value)}
              />
              <div>
                <Button type="submit" color="violet">
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $body: String!) {
    sendMessage(to: $to, body: $body) {
      id
      body
      from
      to
      createdAt
    }
  }
`;

const FETCH_MESSAGES_QUERY = gql`
  query getMessages($username: String!) {
    getMessages(username: $username) {
      body
      from
      to
      id
      createdAt
    }
  }
`;

export default Messages;
