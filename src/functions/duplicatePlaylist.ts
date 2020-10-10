import SpotifyWebApi from 'spotify-web-api-node'
import readline from 'readline-sync'

export default async function duplicatePlaylist(client: SpotifyWebApi): Promise<void> {
  try {
    const originalPlaylistLink = readPlaylistLink()
    const originalPlaylistId = parsePlaylistIdFromLink(originalPlaylistLink)
    const originalPlaylist = await confirmPlaylist(originalPlaylistId)
    const trackIds = await getAllTrackIdsFromPlaylist(originalPlaylist)
    const newPlaylist = await createNewPlaylist()
    await addTracksToPlaylist(newPlaylist, trackIds)
  } catch (error) {
    console.log('Operação Cancelada')
    console.log('\n')
  }

  function readPlaylistLink(): string {
    const playlistLink = readline.question('Qual é o link da playlist que deseja copiar?\n> ')
    console.log('\n')
    return playlistLink
  }

  function parsePlaylistIdFromLink(link: string): string {
    const id = link
      .split('?')[0]
      .replace('https://', '')
      .replace('http://', '')
      .replace('open.spotify.com/playlist/', '')

    return id
  }

  async function confirmPlaylist(playlistId: string): Promise<SpotifyApi.PlaylistObjectFull> {
    try {
      const { body: playlist } = await client.getPlaylist(playlistId)

      const confirmationMessage = `Duplicando a playlist "${playlist.name}", criada por "${playlist.owner.display_name}". Confere? [S/N]: `
      const option = readline.keyIn(confirmationMessage, { limit: 'sn' }).toLowerCase()
      console.log('\n')

      if (option === 'n') throw new Error()

      return playlist
    } catch (error) {
      if (error.statusCode === 404) {
        console.log('Não encontrei essa playlist! =/ Tem certeza que ela está pública e que o link está correto?')
      }
      throw error
    }
  }

  async function getAllTrackIdsFromPlaylist(playlist: SpotifyApi.PlaylistObjectFull): Promise<string[]> {
    const totalOfSongs = playlist.tracks.total
    const iterations = Math.floor(totalOfSongs / 100) + 1

    let trackIds: string[] = []

    for (let i = 0; i < iterations; i++) {
      const { body: ids } = await client.getPlaylistTracks(playlist.id, { offset: i * 100 })
      trackIds = [...trackIds, ...ids.items.map(({ track }) => track.id)]
    }

    return trackIds
  }

  async function createNewPlaylist(): Promise<SpotifyApi.PlaylistObjectFull> {
    const newPlaylistName = readline.question('Qual é o nome da nova playlist?\n> ')
    console.log()
    const newPlaylistDescription = readline.question('Qual é a descrição da nova playlist?\n> ')

    const userId = await (await client.getMe()).body.id

    const { body: playlist } = await client.createPlaylist(userId, newPlaylistName, {
      description: newPlaylistDescription,
      public: true,
    })

    return playlist
  }

  async function addTracksToPlaylist(playlist: SpotifyApi.PlaylistObjectFull, trackIds: string[]): Promise<void> {
    const steps = 50
    for (let i = 0; i < trackIds.length; i += steps) {
      await client
        .addTracksToPlaylist(
          playlist.id,
          trackIds.slice(i, steps + i).map((id) => `spotify:track:${id}`),
          { position: 0 },
        )
        .catch((e) => console.log(JSON.stringify(e)))
    }
  }
}
