import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { Label, Button, Card, Grid } from "semantic-ui-react";
import FollowButton from "../FollowButton";
import { FETCH_USER_QUERY } from "../../util/graphql";

function SingleUser(props) {
  const username = props.match.params.username;
  const { user } = useContext(AuthContext);
  const { loading, data: { getUser } = {} } = useQuery(FETCH_USER_QUERY, {
    variables: {
      username,
    },
  });
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
      </Grid>
    );
  } else {
    userMarkup = <div>Cannot load user.</div>;
  }
  return userMarkup;
}

export default SingleUser;
