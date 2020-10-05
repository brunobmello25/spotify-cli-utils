import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import * as oauthCredentials from '../credentials/oauth.json'

async function authenticateWithOAuth(): Promise<void> {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  // await requestUserConsent()
  // await waitForSpotifyCallback()
  // await requestSpotifyForAccessTokens()
  // await setGlobalSpotifyAuthentication()
  // await stopWebServer()

  async function startWebServer() {
    const port = 5000
    const app = express()

    const server = app.listen(port, () => {
      console.log(`> Listening on http://localhost:${port}`)
    })

    return { server, app }
  }

  async function createOAuthClient() {
    const OAuthClient = new SpotifyWebApi({
      clientId: oauthCredentials.clientId,
      clientSecret: oauthCredentials.clientSecret,
      redirectUri: oauthCredentials.redirectUri,
    })

    return OAuthClient
  }
}

export default authenticateWithOAuth
