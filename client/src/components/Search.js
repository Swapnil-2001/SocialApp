import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { Input } from "semantic-ui-react";
import gql from "graphql-tag";

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
                <Link to={`/user/${user.username}`}>{user.username}</Link>
              </h3>
            ))}
          </div>
        ))}
    </div>
  );
}

const FETCH_SEARCHED_USERS = gql`
  query getUsers($search: String!) {
    getUsers(search: $search) {
      id
      username
    }
  }
`;

export default Search;
