import express from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import oauthCredentials from '../credentials/oauth.json'
import scopes from '../config/scopes.json'

async function authenticateWithOAuth(): Promise<void> {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  await requestUserConsent(OAuthClient)
  const authCode = await waitForSpotifyCallback()
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

  async function waitForSpotifyCallback(): Promise<string> {
    return new Promise((resolve) => {
      console.log('> Aguardando autenticação...')

      webServer.app.get('/oauth2callback', (req, res) => {
        const authCode = req.query.code as string
        console.log('> Autenticado com sucesso!\n')

        res.send('<h1>Obrigado!</h1> <p>Você já pode fechar esta janela</p>')

        resolve(authCode)
      })
    })
  }
}

export default authenticateWithOAuth
