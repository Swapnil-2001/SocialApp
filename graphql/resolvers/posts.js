const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPostsByUser(_, { username }) {
      try {
        const posts = await Post.find({ username });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        }
        throw new Error("Post not found.");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body, image }, context) {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new Error("Post body cannot be empty.");
      }
      const newPost = new Post({
        body,
        image,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      const post = await newPost.save();
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("Post not found.");
        }
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully.";
        } else {
          throw new AuthenticationError("Action not allowed.");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);
      const post = await Post.findById(postId);
      if (post) {
        const likeByUserIndex = post.likes.findIndex(
          (like) => like.username === username
        );
        if (likeByUserIndex === -1) {
          post.likes.unshift({
            username,
            createdAt: new Date().toISOString(),
          });
        } else {
          post.likes.splice(likeByUserIndex, 1);
        }
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found.");
      }
    },
  },
};
