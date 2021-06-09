const gql = require("graphql-tag");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    image: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type Follow {
    id: ID!
    username: String!
  }
  type Chat {
    id: ID!
    read: Boolean!
    username: String!
  }
  type Message {
    id: ID!
    body: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type User {
    id: ID!
    token: String!
    image: String!
    username: String!
    email: String!
    createdAt: String!
    followers: [Follow]!
    following: [Follow]!
    chats: [Chat]!
  }
  input RegisterInput {
    image: String!
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  input UserInput {
    id: ID!
    image: String!
    email: String!
  }
  type Query {
    getMessages(username: String!): [Message]
    getUsers(search: String!): [User]
    getUser(username: String!): User
    getChats: [Chat]
    getPosts: [Post]
    getPostsByUser(username: String!): [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    resetPassword(
      username: String!
      oldPassword: String!
      newPassword: String!
    ): User!
    sendMessage(to: String!, body: String!): Message!
    changeRead(username: String!, newStatus: Boolean!): User!
    updateUser(userInput: UserInput): User!
    followUser(otherUsername: String!): Follow!
    createPost(body: String!, image: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  type Subscription {
    newMessage: Message!
  }
`;
