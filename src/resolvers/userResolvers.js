import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import { AuthenticationError } from 'apollo-server-errors'

export const userResolvers = {
  Query: {
    // get current data
    // auth only
    getCurrentUser: async (_, __, context) => {
      if (!context || !context.user) {
        throw new AuthenticationError(`NO token`)
      }
      const {
        user: { _id }
      } = context.user

      const user = await User.findById(_id).select('-password')
      return user
    }
  },

  // All mutation definations
  Mutation: {
    // parent, args, context
    createUser: async (_, { name, email, password }) => {
      let userCheck = await User.findOne({ email })

      if (userCheck) {
        throw new AuthenticationError('USER ALREADY EXISTS')
      }
      const hashedPass = await bcrypt.hash(password, 12)

      let user = new User({
        name,
        email,
        password: hashedPass
      })
      await user.save()
      return user
    },

    // login mutation
    login: async (_, { email, password }, context) => {
      try {
        const user = await User.findOne({ email })

        const userWOpass = await User.findOne({ email }).select('-password')
        if (user && (await bcrypt.compare(password, user.password))) {
          const token = generateToken(userWOpass)

          const userToReturn = {
            _id: userWOpass._id,
            name: userWOpass.name,
            email: userWOpass.email,

            token: token
          }
          return userToReturn
        } else {
          throw new AuthenticationError(`INVALID CREDS`)
        }
      } catch (error) {
        throw new AuthenticationError(
          `ERROR IN LOGIN, MESSAGE:${error.message}`
        )
      }
    }
  }
}
