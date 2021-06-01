import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import { useMessageState, useMessageDispatch } from "../../context/message";
import "../styles/Messages.css";

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
    if (getMessages) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser,
          messages: getMessages,
        },
      });
    }
  }, [getMessages, dispatch, selectedUser]);
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
        <>
          <div>
            {messages &&
              messages.map((message) => (
                <div
                  key={message.id}
                  className={message.from === selectedUser ? "other" : "me"}
                >
                  {message.body}
                </div>
              ))}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <Form.Input
                value={body}
                placeholder="Write a message"
                onChange={(e) => setBody(e.target.value)}
              />
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button type="submit" color="teal">
                  Create
                </Button>
              </div>
            </Form.Field>
          </Form>
        </>
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
