import { gql } from 'apollo-server-core'

export const transactionTypeDef = gql`
  "---all querys here---"
  type Query {
    getUserTransactions(where: WHEREFILTER): [Transaction]
  }

  input WHEREFILTER {
    type: TypeOfTransaction
    category: String
    amount: String
    dd: String
    mm: String
    yyyy: String
  }
  type Transaction {
    _id: ID!
    type: TypeOfTransaction
    category: String!
    amount: String!
    dd: String!
    mm: String!
    yyyy: String!
  }
  type RETURN_CREATE_STATUS {
    message: String!
  }
  enum TypeOfTransaction {
    DEPOSIT
    EXPENSE
  }

  "---all mutations here---"
  type Mutation {
    createTransaction(
      type: TypeOfTransaction!
      amount: String!
      category: String!
      dd: String!
      mm: String!
      yyyy: String!
    ): RETURN_CREATE_STATUS
  }
`
