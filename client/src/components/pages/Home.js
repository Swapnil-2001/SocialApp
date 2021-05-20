import React, { useContext } from "react";
import { Button } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../../util/graphql";
import { Link } from "react-router-dom";

import Menubar from "../Menubar";
import { AuthContext } from "../../context/auth";
import PostForm from "../PostForm";
import PostCard from "../PostCard";
import "../styles/Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);
  return (
    <>
      <Menubar />
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <Button color="grey" as={Link} to="/search">
          Search Users
        </Button>
      </div>
      <div className="each__post">
        {user && (
          <div>
            <PostForm />
          </div>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <div key={post.id}>
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Home;
