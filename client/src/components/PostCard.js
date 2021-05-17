import React, { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Card, Icon, Label, Button } from "semantic-ui-react";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../context/auth";

const PostCard = ({
  post: {
    id,
    body,
    image,
    createdAt,
    username,
    likes,
    likeCount,
    commentCount,
  },
}) => {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header as={Link} to={`/user/${username}`}>
          {username}
        </Card.Header>
        {image.length > 0 && <img src={image} alt="postImg" />}
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="teal" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="teal" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && <DeleteButton id={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
