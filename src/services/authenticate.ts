import express from 'express'

async function authenticateWithOAuth(): Promise<void> {
  const webServer = await startWebServer()
  // await createOAuthClient()
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
}

export default authenticateWithOAuth
