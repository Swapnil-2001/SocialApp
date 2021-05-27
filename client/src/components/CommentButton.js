import { ReactComponent as Comment } from "./images/comment.svg";
import { Link } from "react-router-dom";
import "./styles/Like.css";

export default function CommentButton({ id, commentCount }) {
  return (
    <div className="like__div">
      <div style={{ width: "25px" }}>
        <Link to={`/posts/${id}`}>
          <Comment fill="#606470" />
        </Link>
      </div>
      {commentCount}
    </div>
  );
}
