const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  image: String,
  createdAt: String,
  followers: [
    {
      username: String,
    },
  ],
  following: [
    {
      username: String,
    },
  ],
});

module.exports = model("User", userSchema);
