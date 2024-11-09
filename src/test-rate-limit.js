import fetch from 'node-fetch'

async function testRateLimit() {
  const NUM_REQUESTS = 10 // We'll send 10 requests (more than our limit of 5)

  console.log('Starting rate limit test...')
  console.log(`Sending ${NUM_REQUESTS} requests...`)

  const requests = Array(NUM_REQUESTS)
    .fill()
    .map(async (_, i) => {
      try {
        const response = await fetch('http://localhost:1227/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: '{ __schema { types { name } } }' // Simple introspection query
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

      // Add a small delay between requests to make output more readable
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

  await Promise.all(requests)
  console.log('Rate limit test completed')
}

testRateLimit()
