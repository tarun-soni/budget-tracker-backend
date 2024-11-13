import { connectDB } from './db/connection.js'

async function checkDBConnection() {
  await connectDB()
}

// Self-executing async function
;(async () => {
  try {
    await checkDBConnection()
  } catch (error) {
    console.error('Error checking DB connection:', error)
    process.exit(1)
  }
})()
