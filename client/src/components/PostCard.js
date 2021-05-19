import React, { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Icon, Label, Button } from "semantic-ui-react";

import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../context/auth";
import "./styles/PostCard.css";

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
    <div className="postcard__wrapper">
      <h3>
        <Link to={`/user/${username}`}>{username}</Link>
      </h3>
      {image.length > 0 && <img src={image} alt="postImg" />}
      <p>
        <Link to={`/posts/${id}`}>{moment(createdAt).fromNow()}</Link>
      </p>
      <p>{body}</p>
      <div style={{ display: "flex" }}>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button size="tiny" labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button size="tiny" color="teal" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="teal" pointing="left">
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && <DeleteButton id={id} />}
      </div>
    </div>
  );
};

export default PostCard;
