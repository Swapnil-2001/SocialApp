import React, { useContext } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import CommentButton from "./CommentButton";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import { AuthContext } from "../context/auth";
import "./styles/PostCard.css";

const truncate = (s) => (s.length > 75 ? s.substring(0, 75) + "..." : s);

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
      <h4>
        <Link to={`/user/${username}`}>{username}</Link>
      </h4>
      {image.length > 0 && <img src={image} alt="postImg" />}
      <h3>{truncate(body)}</h3>
      <div>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <CommentButton id={id} commentCount={commentCount} />
        <p style={{ marginLeft: "auto" }}>
          <Link to={`/posts/${id}`}>Go to post</Link>{" "}
        </p>
      </div>
      <div>
        <p>{moment(createdAt).fromNow()}</p>
        {user && user.username === username && <DeleteButton id={id} />}
      </div>
    </div>
  );
};

export default PostCard;
