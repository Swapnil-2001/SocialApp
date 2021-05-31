const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");

module.exports = {
  Mutation: {
    async createComment(_, { postId, body }, { user }) {
      if (!user) throw new AuthenticationError("Unauthenticated");
      const { username } = user;
      if (body.trim() === "") {
        throw new UserInputError("Empty comment.", {
          errors: {
            body: "Comment body must not be empty!",
          },
        });
      }
      const post = await Post.findById(postId);
      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found.");
      }
    },
    async deleteComment(_, { postId, commentId }, { user }) {
      if (!user) throw new AuthenticationError("Unauthenticated");
      const { username } = user;
      const post = await Post.findById(postId);
      if (post) {
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );
        if (commentIndex === -1) {
          throw new UserInputError("Comment not found.");
        }
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed.");
        }
      } else {
        throw new UserInputError("Post not found.");
      }
    },
  },
};
