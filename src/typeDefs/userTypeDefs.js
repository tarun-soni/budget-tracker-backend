import { gql } from 'apollo-server-core'

export const userTypeDefs = gql`
  "---all querys here---"
  type Query {
    "user queries"
    getCurrentUser: User!
  }

  "user schema type"
  type User {
    _id: ID
    name: String!
    email: String!
  }

  "user type which returns user data+token on login"
  type Login_Return_User {
    _id: ID
    name: String!
    email: String!
    token: String!
  }

  "---all mutations here---"
  type Mutation {
    "register or create user"
    createUser(
      name: String!
      email: String!
      password: String!
      isAdmin: Boolean
    ): User!

    "returns string bascically the jwt token"
    login(email: String!, password: String!): Login_Return_User!
  }
`
