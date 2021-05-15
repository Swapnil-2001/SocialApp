const postsResolvers = require("./posts");
const commentsResolvers = require("./comments");
const userResolvers = require("./users");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...userResolvers.Query,
    ...postsResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...userResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
