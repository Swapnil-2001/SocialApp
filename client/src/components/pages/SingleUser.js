import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { Label, Button, Card, Grid } from "semantic-ui-react";
import FollowButton from "../FollowButton";
import { Link } from "react-router-dom";
import { FETCH_USER_QUERY } from "../../util/graphql";
import gql from "graphql-tag";

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
    const { email, createdAt, followers, following } = getUser;
    userMarkup = (
      <Grid>
        <Grid.Row>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>Joined {moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description></Card.Description>
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
            </Card.Content>
          </Card>
          <hr />
          <div>
            {followers.length > 0 &&
              followers.map((follower) => (
                <div key={follower.id}>{follower.username}</div>
              ))}
            {following.length > 0 &&
              following.map((follow) => (
                <div key={follow.id}>{follow.username}</div>
              ))}
          </div>
          <Card.Content extra>
            <Button as="div" labelPosition="right" onClick={() => {}}>
              <Label basic color="blue" pointing="left">
                {email}
              </Label>
            </Button>
          </Card.Content>
        </Grid.Row>
        <Grid.Row>
          {!loadPosts &&
            posts &&
            posts.map(({ body, id }) => (
              <Grid.Column key={id}>
                <Card fluid as={Link} to={`/posts/${id}`}>
                  <Card.Content>
                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{body}</Card.Description>
                  </Card.Content>
                  <Card.Content extra></Card.Content>
                </Card>
              </Grid.Column>
            ))}
        </Grid.Row>
      </Grid>
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
