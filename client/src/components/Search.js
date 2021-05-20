import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Input } from "semantic-ui-react";
import gql from "graphql-tag";
import Menubar from "./Menubar";
import none from "./no.png";

import "./styles/Search.css";

function Search() {
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
      <Menubar />
      <div className="search__wrapper">
        <div style={{ margin: "20px", textAlign: "center" }}>
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
                <h3 key={user.id}>
                  <Link to={`/user/${user.username}`}>
                    <div className="ind__user">
                      <img src={user.image ? user.image : none} alt="user" />
                      <p>{user.username}</p>
                    </div>
                  </Link>
                </h3>
              ))}
            </div>
          ))}
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

export default Search;
