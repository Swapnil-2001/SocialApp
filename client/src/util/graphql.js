import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      image
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export const FETCH_USER_QUERY = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      id
      username
      email
      createdAt
      image
      followers {
        username
      }
      following {
        username
      }
    }
  }
`;
