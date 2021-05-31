import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Input } from "semantic-ui-react";
import gql from "graphql-tag";

import MessageList from "./message/Messages";
import Menubar from "./Menubar";
import none from "./images/no.png";
import "./styles/Messages.css";

function Messages() {
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
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
      <Menubar active="search" />
      <div className="dm__wrapper">
        <div className="dm__search">
          <div style={{ margin: "50px", textAlign: "center" }}>
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
              <div>
                {getUsers.map((user) => (
                  <div
                    onClick={() => setSelected(user.username)}
                    key={user.id}
                    className=""
                  >
                    <img src={user.image ? user.image : none} alt="user" />
                    <p>{user.username}</p>
                  </div>
                ))}
              </div>
            ))}
        </div>
        <div>{selected.length > 0 && <MessageList selected={selected} />}</div>
      </div>
    </>
  );
}

const FETCH_SEARCHED_USERS = gql`
  query getUsers($search: String!) {
    getUsers(search: $search) {
      id
      image
      username
    }
  }
`;

export default Messages;
