import readline from 'readline-sync'
import SpotifyWebApi from 'spotify-web-api-node'
import { duplicatePlaylist } from '../functions'

export default async function menu(client: SpotifyWebApi): Promise<void> {
  const functions: Array<(client: SpotifyWebApi) => Promise<void>> = [duplicatePlaylist]

  while (true) {
    const option = readline.keyInSelect(['Duplicar uma playlist'], 'O que deseja fazer?', { cancel: 'Sair' })

    if (option === -1) break

    await functions[option](client)
  }

  console.log()
}
