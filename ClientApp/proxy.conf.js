const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7123';//orig 7113

const PROXY_CONFIG = [
  {
    context: [
      "/copac",//controlleri aci. musai
      "/uzernumemail",
      "/numarcopacs",

      "/weatherforecast",
      "/Identity"
   ],
    proxyTimeout: 10000,
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
