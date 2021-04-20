import { Transaction } from '../models/Transaction.js'
import { AuthenticationError } from 'apollo-server-errors'

export const transactionResolver = {
  Query: {
    getUserTransactions: async (_, args, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`No token`)
      }

      const filter = JSON.parse(JSON.stringify(args))

      const {
        user: { _id }
      } = context.user

      const transactions = await Transaction.find({
        ...filter.where,
        user: _id
      })

      return transactions
    }
  },

  // All mutation definations
  Mutation: {
    createTransaction: async (_, args, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`No token`)
      }

      console.log(`context.user`, context.user)
      const {
        user: { _id }
      } = context.user

      const { type, amount, dd, mm, yyyy, category } = args

      console.log(`args`, args)
      let transaction = new Transaction({
        user: _id,
        type,
        amount,
        dd,
        mm,
        yyyy,
        category
      })
      await transaction.save()
      return { message: 'created' }
    }
  }
}
