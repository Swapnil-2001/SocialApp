import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useQuery } from "@apollo/client";
import moment from "moment";
import FollowButton from "../FollowButton";
import { Link } from "react-router-dom";
import { FETCH_USER_QUERY } from "../../util/graphql";
import gql from "graphql-tag";
import "../styles/SingleUser.css";

function SingleUser(props) {
  const username = props.match.params.username;
  const { user } = useContext(AuthContext);
  const { loading, data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username,
    },
  });
  const { loadPosts, data: { getPostsByUser: posts } = {} } = useQuery(
    FETCH_USER_POSTS,
    {
      fetchPolicy: "no-cache",
      variables: {
        username,
      },
    }
  );
  let userMarkup;
  if (loading) {
    userMarkup = <div>Loading User...</div>;
  } else if (getUser) {
    const { image, email, createdAt, followers, following } = getUser;
    userMarkup = (
      <div>
        <div className="wrapper">
          <div className="user">
            <div className="image__div">
              <img src={image} alt="user" />
              <div>Joined {moment(createdAt).fromNow()}</div>
            </div>
            <div className="user__info__div">
              <h2>{username}</h2>
              <div className="first__span">
                {posts && <span>{posts.length} Posts</span>}
                <span>{followers.length} Followers</span>
                <span>{following.length} Following</span>
              </div>
              <p>{email}</p>
              {user && user.username === username && (
                <div>
                  <Link to={`/update/${username}`}>Edit Profile</Link>
                </div>
              )}
              {followers.length > 0 && (
                <>
                  <span>Followed by</span>
                  <span>
                    <Link to={`/user/${followers[0].username}`}>
                      {followers[0].username}
                    </Link>
                  </span>
                  {followers.length > 1 && (
                    <span>and {followers.length - 1} others</span>
                  )}
                </>
              )}
            </div>
          </div>
          {user && user.username !== username ? (
            followers.find(
              (follower) => follower.username === user.username
            ) ? (
              <FollowButton
                currentUser={{
                  currentUsername: user.username,
                  currentUserId: user.id,
                }}
                otherUsername={username}
                text="Unfollow"
              />
            ) : (
              <FollowButton
                currentUser={{
                  currentUsername: user.username,
                  currentUserId: user.id,
                }}
                otherUsername={username}
                text="Follow"
              />
            )
          ) : (
            <div />
          )}
        </div>
        <div>
          {following.length > 0 &&
            following.map((follow) => (
              <div key={follow.id}>{follow.username}</div>
            ))}
        </div>
        {/* <div>{email}</div> */}
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          {!loadPosts &&
            (posts ? (
              <h2>Posts by {username}</h2>
            ) : (
              <h4>No Posts by {username}</h4>
            ))}
        </div>
        <div className="user__page__posts">
          {!loadPosts &&
            posts &&
            posts.map(({ body, id, likeCount, commentCount }) => (
              <div key={id}>
                <h4>{body}</h4>
                <div className="counts__div">
                  {likeCount} likes, {commentCount} comments
                </div>
                <div className="footer">
                  <p>{moment(createdAt).fromNow()}</p>
                  <span>
                    <Link to={`/posts/${id}`}>Go to post</Link>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  } else {
    userMarkup = <div>Cannot load user.</div>;
  }
  return userMarkup;
}

const FETCH_USER_POSTS = gql`
  query getPostsByUser($username: String!) {
    getPostsByUser(username: $username) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SingleUser;
