import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import { expressjwt } from 'express-jwt'
import dotenv from 'dotenv'
import cors from 'cors'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'

import { userResolvers } from './resolvers/userResolvers.js'
import { userTypeDefs } from './typeDefs/userTypeDefs.js'
import { transactionTypeDef } from './typeDefs/transactionTypeDef.js'

import { transactionResolver } from './resolvers/transactionResolver.js'
import jwt from 'jsonwebtoken'
import path from 'path'
dotenv.config()

const PORT = process.env.PORT || 1227

const app = express()
app.use(cors())

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      message: 'Invalid token or no token provided'
    })
  } else {
    next(err)
  }
})

app.use(
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false
  }).unless({
    path: [
      '/graphql', // Allow unauthenticated access to GraphQL endpoint
      '/login', // Allow login
      '/register' // Allow registration
    ]
  })
)

const startServer = async () => {
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    console.log('db connected')
  })

  db.on('disconnected', () => {
    console.log('db disconnected')
  })

  const server = new ApolloServer({
    typeDefs: mergeTypeDefs([userTypeDefs, transactionTypeDef]),
    resolvers: mergeResolvers([userResolvers, transactionResolver]),
    context: ({ req }) => {
      const auth = req.headers.authorization || ''

      if (auth) {
        try {
          const token = auth.split(' ')[1]
          const user = jwt.verify(token, process.env.JWT_SECRET)
          return { user }
        } catch (error) {
          console.error('Token verification failed:', error.message)
          return { user: null }
        }
      }
      return { user: null }
    }
  })

  // Await the server to start
  await server.start()

  // Apply middleware after the server has started
  server.applyMiddleware({ app })

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const __dirname = path.resolve()

  app.listen({ port: PORT }, () => {
    console.log(`
    🚀  Server is running!
    🔉  Listening on port ${PORT}
    📭  Query at http://localhost:${PORT}${server.graphqlPath}
  `)
  })

  if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })
  } else {
    app.get('/', (req, res) => {
      res.send('API running....')
    })
  }
}

startServer()
