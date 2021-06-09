import React, { useState, useEffect } from "react";
import {
  useLazyQuery,
  useQuery,
  useSubscription,
  useMutation,
} from "@apollo/client";
import { Input } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";

import { useAuthState } from "../context/auth";
import { useMessageDispatch, useMessageState } from "../context/message";
import MessageList from "./message/MessageList";
import Menubar from "./Menubar";
import "./styles/Messages.css";

function Messages() {
  const { user } = useAuthState();
  const history = useHistory();
  if (!user) {
    history.push("/");
  }
  const [selected, setSelected] = useState(null);
  const { users, selectedUser } = useMessageState();
  const messageDispatch = useMessageDispatch();
  const { data: { getChats } = {} } = useQuery(FETCH_CHATS);
  useEffect(() => {
    if (!users && getChats) {
      messageDispatch({
        type: "SET_USERS",
        payload: getChats,
      });
    }
  }, [users, messageDispatch, getChats]);
  const [search, setSearch] = useState("");
  const [toggleRead] = useMutation(CHANGE_READ, {
    onError(err) {
      return err;
    },
  });
  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;
      if (message.to !== user.username || otherUser === selectedUser) {
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: {
            username: otherUser,
            message,
            selectChat: message.to !== user.username,
            read: true,
          },
        });
        if (message.to === user.username)
          toggleRead({ variables: { username: otherUser, newStatus: true } });
      } else {
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: {
            username: otherUser,
            message,
            selectChat: message.to !== user.username,
            read: false,
          },
        });
        toggleRead({ variables: { username: otherUser, newStatus: false } });
      }
    }
  }, [toggleRead, messageError, messageData, messageDispatch, user]);

  const [getSearchedUsers, { loading, data: { getUsers } = {} }] = useLazyQuery(
    FETCH_SEARCHED_USERS,
    {
      variables: {
        search,
      },
    }
  );
  const handleChange = (e) => {
    setSearch(e.target.value);
    getSearchedUsers();
  };
  return (
    <>
      <Menubar active="message" />
      <div className="dm__wrapper">
        <div className="dm__search">
          <h2 style={{ margin: "40px 0 30px 0" }}>Messages</h2>
          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <Input
              placeholder="Username"
              icon="search"
              value={search}
              onChange={handleChange}
            />
          </div>
          {search.length > 0 &&
            !loading &&
            (getUsers.length === 0 ? (
              <p>No users by this username!</p>
            ) : (
              <div style={{ backgroundColor: "#deedf0", borderRadius: "10px" }}>
                {getUsers.map((user) => (
                  <div
                    onClick={() => {
                      setSelected(user.username);
                      if (!user.read) {
                        toggleRead({
                          variables: {
                            username: user.username,
                            newStatus: true,
                          },
                        });
                      }
                    }}
                    key={user.username}
                    className="search__users"
                  >
                    <p>{user.username}</p>
                  </div>
                ))}
              </div>
            ))}
          <div>
            {users &&
              users.map((chat) => (
                <div
                  onClick={() => {
                    setSelected(chat.username);
                    if (!chat.read) {
                      toggleRead({
                        variables: { username: chat.username, newStatus: true },
                      });
                    }
                  }}
                  key={chat.username}
                  className={
                    chat.selected
                      ? "chat__users selected"
                      : chat.read
                      ? "chat__users"
                      : "chat__unread"
                  }
                >
                  <p>{chat.username}</p>
                </div>
              ))}
          </div>
        </div>
        <div>{selected && <MessageList selectedUser={selected} />}</div>
      </div>
    </>
  );
}

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      id
      body
      from
      to
      createdAt
    }
  }
`;

const FETCH_CHATS = gql`
  query getChats {
    getChats {
      username
      read
    }
  }
`;

const FETCH_SEARCHED_USERS = gql`
  query getUsers($search: String!) {
    getUsers(search: $search) {
      id
      image
      username
    }
  }
`;

const CHANGE_READ = gql`
  mutation changeRead($username: String!, $newStatus: Boolean!) {
    changeRead(username: $username, newStatus: $newStatus) {
      chats {
        username
        read
      }
    }
  }
`;

export default Messages;
