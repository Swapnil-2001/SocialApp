import React from "react";
import { useQuery } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../../util/graphql";
import Menubar from "../Menubar";
import { useAuthState } from "../../context/auth";
import PostForm from "../PostForm";
import PostCard from "../PostCard";
import "../styles/Home.css";

function Home() {
  const { user } = useAuthState();
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);
  return (
    <>
      <Menubar active="home" />
      <div className="each__post">
        {user && <PostForm />}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          posts && posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </>
  );
}

export default Home;
