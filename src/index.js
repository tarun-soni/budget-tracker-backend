import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import mongoose from 'mongoose'
import expressJwt from 'express-jwt'
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

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false
  })
)
app.get('/api/users/me', async (req, res) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      await res.send(decoded.user)
    } catch (error) {
      console.error('error in auth middleware :>> ', error)
      res.status(401).send({
        message: 'Please Login'
      })
      // throw new Error('Not authorized, token failed')
    }
  }
  if (!token) {
    res.status(401).send({
      message: 'Please Login'
    })
  }
})
const startServer = async () => {
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', () => {
    console.log('db connected')
  })

  const server = new ApolloServer({
    typeDefs: mergeTypeDefs([userTypeDefs, transactionTypeDef]),
    resolvers: mergeResolvers([userResolvers, transactionResolver]),
    context: ({ req, res }) => {
      const user = req.user || null
      return { user }
    }
  })

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
