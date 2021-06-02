import React from "react";
import { Label, Icon, Button, Card, Grid } from "semantic-ui-react";
import { useQuery } from "@apollo/client";
import moment from "moment";
import gql from "graphql-tag";

import { useAuthState } from "../../context/auth";
import LikeButton from "../LikeButton";
import DeleteButton from "../DeleteButton";

// add comments

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useAuthState();
  const { loading, data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const deleteCallback = () => props.history.push("/");
  let postMarkup;
  if (loading) {
    postMarkup = <div>Loading Post...</div>;
  } else {
    const { id, body, createdAt, username, likes, likeCount, commentCount } =
      getPost;
    postMarkup = (
      <Grid>
        <Grid.Row>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
          </Card>
          <hr />
          <Card.Content extra>
            <LikeButton user={user} post={{ id, likeCount, likes }} />
            <Button as="div" labelPosition="right" onClick={() => {}}>
              <button basic="true" color="blue">
                <Icon name="comments" />
              </button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
            {user && user.username === username && (
              <DeleteButton id={id} callback={deleteCallback} />
            )}
          </Card.Content>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
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

export default SinglePost;
