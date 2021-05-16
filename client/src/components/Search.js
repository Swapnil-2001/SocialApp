import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";

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
    <div>
      <input value={search} onChange={handleChange} type="text" />
      {search.length > 0 &&
        !loading &&
        (getUsers.length === 0 ? (
          <p>No users by this username.</p>
        ) : (
          <div>
            <ul>
              {getUsers.map((user) => (
                <li key={user.id}>
                  <Link to="">{user.username}</Link>
                </li>
              ))}
            </ul>
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
