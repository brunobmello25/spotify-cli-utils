import { Server } from 'http'
import express, { Express } from 'express'
import SpotifyWebApi from 'spotify-web-api-node'
import open from 'open'

import oauthCredentials from '../credentials/oauth.json'
import scopes from '../config/scopes.json'

interface IWebServer {
  server: Server
  app: Express
}

async function authenticate(): Promise<SpotifyWebApi> {
  const webServer = await startWebServer()
  const OAuthClient = await createOAuthClient()
  await requestUserConsent(OAuthClient)
  const authCode = await waitForSpotifyCallback()
  await setAccessAndRefreshTokens(OAuthClient, authCode)
  await setRefreshAccessTokenTimeout(OAuthClient)
  await stopWebServer(webServer)

  async function startWebServer(): Promise<IWebServer> {
    const port = 5000
    const app = express()

    const server = app.listen(port)

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

    await open(authorizeUrl)
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

  async function setAccessAndRefreshTokens(OAuthClient: SpotifyWebApi, authCode: string) {
    const authResponse = await OAuthClient.authorizationCodeGrant(authCode)

    OAuthClient.setAccessToken(authResponse.body.access_token)
    OAuthClient.setRefreshToken(authResponse.body.refresh_token)
  }

  async function setRefreshAccessTokenTimeout(OAuthClient: SpotifyWebApi) {
    setInterval(() => {
      OAuthClient.refreshAccessToken()
    }, 1000 * 60 * 30)
  }

  async function stopWebServer(webServer: IWebServer) {
    return new Promise((resolve, reject) => {
      webServer.server.close((err) => {
        if (err) return reject(err)

        return resolve()
      })
    })
  }

  return OAuthClient
}

export default authenticate
