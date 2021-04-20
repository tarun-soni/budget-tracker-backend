import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  type: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },

  category: {
    type: String,
    requried: true
  },
  dd: {
    type: String,
    required: true
  },

  mm: {
    type: String,
    required: true
  },

  yyyy: {
    type: String,
    required: true
  }
})
export const Transaction = mongoose.model('Transaction', transactionSchema)
