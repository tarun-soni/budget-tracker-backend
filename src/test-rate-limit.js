import fetch from 'node-fetch'

async function testRateLimit() {
  const NUM_REQUESTS = 10

  console.log('Starting rate limit test...')
  console.log(`Sending ${NUM_REQUESTS} requests...`)

  const requests = Array.from({ length: NUM_REQUESTS }, async (_, i) => {
    try {
      const response = await fetch('http://localhost:1227/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: '{ __schema { types { name } } }'
        })
      })

      const remaining = response.headers.get('ratelimit-remaining')
      const status = response.status

      console.log(`Request ${i + 1}:`)
      console.log(`  Status: ${status}`)
      console.log(`  Remaining requests: ${remaining}`)

      if (status === 429) {
        const body = await response.text()
        console.log(`  Rate limit message: ${body}`)
      }
    } catch (error) {
      console.error(`Request ${i + 1} failed:`, error.message)
    }

    // Using more precise timing with performance.now()
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  await Promise.all(requests)
  console.log('Rate limit test completed')
}

// Self-executing async function
;(async () => {
  try {
    await testRateLimit()
  } catch (error) {
    console.error('Test failed:', error)
    process.exit(1)
  }
})()
