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

      const {
        user: { _id }
      } = context.user

      const { type, amount, dd, mm, yyyy, category } = args

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
    },

    updateTransaction: async (_, args, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`No token`)
      }

      const {
        user: { _id }
      } = context.user

      const transactionToUpdate = await Transaction.findOne({ _id: args.id })

      if (transactionToUpdate) {
        if (String(transactionToUpdate.user) === _id) {
          transactionToUpdate.type = args.type
          transactionToUpdate.amount = args.amount
          transactionToUpdate.category = args.category
          await transactionToUpdate.save()
          return { message: 'updated' }
        } else {
          throw new AuthenticationError(`You're not authorized`)
        }
      } else {
        return { message: 'Not Found' }
      }
    },

    deleteTransaction: async (_, args, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`No token`)
      } else {
        const transactionToDelete = await Transaction.findOne({ _id: args.id })

        if (transactionToDelete) {
          await transactionToDelete.remove()

          return { message: 'DELETED' }
        } else {
          return { message: 'Transaction Not Found' }
        }
      }
    }
  }
}
