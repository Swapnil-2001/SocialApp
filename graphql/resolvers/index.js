const postsResolvers = require("./posts");
const commentsResolvers = require("./comments");
const userResolvers = require("./users");
const messageResolvers = require("./messages");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...userResolvers.Query,
    ...postsResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...postsResolvers.Mutation,
    ...userResolvers.Mutation,
    ...commentsResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
