const { UserInputError } = require("apollo-server");

const Message = require("../../models/Message");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getMessages(_, { username }, context) {
      const user = checkAuth(context);
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
    async sendMessage(_, { to, body }, context) {
      const user = checkAuth(context);
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
        return message;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
