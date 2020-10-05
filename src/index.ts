import authenticate from './services/authenticate'

async function start() {
  await authenticate()
}

start().catch((e) => console.log(JSON.stringify(e)))
