import React, { useContext } from "react";
import { Button, Grid } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
import { FETCH_POSTS_QUERY } from "../../util/graphql";

import { AuthContext } from "../../context/auth";
import PostForm from "../PostForm";
import PostCard from "../PostCard";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Button color="grey" as={Link} to="/search">
          Search Users
        </Button>
      </div>
      <Grid columns={3}>
        <Grid.Row className="page__title">
          <h1>Recent Posts</h1>
        </Grid.Row>
        <Grid.Row>
          {user && (
            <Grid.Column>
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <h1>Loading Posts...</h1>
          ) : (
            posts &&
            posts.map((post) => (
              <Grid.Column key={post.id}>
                <PostCard post={post} />
              </Grid.Column>
            ))
          )}
        </Grid.Row>
      </Grid>
    </>
  );
}

export default Home;
