const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");

const Message = require("../../models/Message");
const User = require("../../models/User");

module.exports = {
  Query: {
    async getMessages(_, { username }, { user }) {
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        const otherUser = await User.findOne({ username });
        if (!otherUser) throw new UserInputError("User not found");
        const messages = await Message.find({
          $or: [
            { from: user.username, to: username },
            { from: username, to: user.username },
          ],
        }).sort({ createdAt: -1 });
        return messages;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async sendMessage(_, { to, body }, { user, pubsub }) {
      if (!user) throw new AuthenticationError("Unauthenticated");
      try {
        const otherUser = await User.findOne({ username: to });
        if (!otherUser) throw new UserInputError("User not found.");
        if (user.username === to)
          throw new UserInputError("Message to own self.");
        if (body.trim() === "")
          throw new Error("Message body cannot be empty.");
        const newMessage = new Message({
          body,
          from: user.username,
          to,
          createdAt: new Date().toISOString(),
        });
        const message = await newMessage.save();
        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        return message;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};