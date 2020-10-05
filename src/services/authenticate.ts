import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import oauthCredentials from '../credentials/oauth.json'
import scopes from '../config/scopes.json'

async function authenticateWithOAuth(): Promise<void> {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  await requestUserConsent(OAuthClient)
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

  async function requestUserConsent(OAuthClient: SpotifyWebApi) {
    const authorizeUrl = OAuthClient.createAuthorizeURL(scopes, 'state')

    console.log(`> Por favor, faça login: ${authorizeUrl}`)
  }
}

export default authenticateWithOAuth
