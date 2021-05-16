const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const checkAuth = require("../../util/check-auth");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server");

const generateToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

module.exports = {
  Query: {
    async getUser(_, { userId }) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return user;
        }
        throw new Error("User not found.");
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUsers(_, { search }) {
      try {
        let regExp = new RegExp("^" + search);
        const users = await User.find({ username: regExp });
        return users;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async followUser(_, { otherUsername }, context) {
      const { username } = checkAuth(context);
      const currentUser = await User.findOne({ username });
      const otherUser = await User.findOne({ username: otherUsername });
      if (!otherUser) {
        throw new UserInputError("User not found.", {
          errors: {
            general: "User not found.",
          },
        });
      }
      const index = otherUser.followers.findIndex(
        (follower) => follower.username === username
      );
      if (index !== -1) {
        currentUser.following = currentUser.following.filter(
          (user) => user.username !== otherUsername
        );
        otherUser.followers.splice(index, 1);
      } else {
        currentUser.following.push({
          username: otherUsername,
        });
        otherUser.followers.push({
          username,
        });
      }
      await currentUser.save();
      await otherUser.save();
      return otherUser;
    },
    async resetPassword(_, { username, oldPassword, newPassword }) {
      const { valid, errors } = validateLoginInput(username, oldPassword);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found.", { errors });
      }
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        errors.general = "Wrong credentials.";
        throw new UserInputError("Wrong credentials.", { errors });
      }
      if (newPassword === "") {
        throw new UserInputError("New password cannot be empty.", {
          errors: {
            password: "Password cannot be empty.",
          },
        });
      }
      newPassword = await bcrypt.hash(newPassword, 12);
      const res = await User.findOneAndUpdate(
        { username: user.username },
        { password: newPassword },
        { new: true, useFindAndModify: false }
      );
      const token = generateToken(user);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async login(_, { username, password }) {
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found.";
        throw new UserInputError("User not found.", { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials.";
        throw new UserInputError("Wrong credentials.", { errors });
      }
      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken.", {
          errors: {
            username: "This username is taken.",
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
