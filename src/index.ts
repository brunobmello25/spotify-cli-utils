import authenticate from './services/authenticate'
import menu from './services/menu'

async function start() {
  const client = await authenticate()

  await menu(client)

  console.log('Até mais!')
  process.exit(0)
}

start().catch((e) => console.log(JSON.stringify(e)))
