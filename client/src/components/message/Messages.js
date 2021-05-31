import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Button } from "semantic-ui-react";
import gql from "graphql-tag";

import "../styles/Messages.css";

function Messages({ selected }) {
  const [body, setBody] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
    variables: {
      body,
      to: selected,
    },
  });
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
                  key={message._id}
                  className={message.from === selected ? "other" : "me"}
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
    }
  }
`;

export default Messages;
