import mongoose from 'mongoose'

let cachedConnection = null

export async function connectDB() {
  if (cachedConnection) {
    return cachedConnection
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    cachedConnection = conn
    console.log('MongoDB Connected')
    return conn
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  }
}
