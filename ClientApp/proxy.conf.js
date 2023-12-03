const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7113';//orice merge!?!? //5205 ce-i?

const PROXY_CONFIG = [
  {
    context: [
      "/profpoze",//nu /wwwroot pt tot
      "/favicon.ico",//nu /wwwroot pt tot
      "/contributia.json",
      "/parceas.json",
      "/ro_frontiera_polilinie.json",
      "/rodacinisqlite.db",
      "rodacinisqlite.db",
      "db",
      "wwwroot",
      "wwwroot/rodacinisqlite.db",
      "/db",
      "/db/rodacinisqlite.db",
      "bin",
      "bin/rodacinisqlite.db",
      "/bin",


      "/uzer",//controllerii aici musai
      "/copac",
      //"/uzernumemail",
      //"/numarcopacs",
      "/top",
      "/parcea",
      "/rutaviu",
      "/upload",
      "/ggdpr",
      "/plata",
      "/zbo",

      //"/uzer/IaUzer",//nu face nimic
      //"/uzer/AltcevaUzer",//nu face nimic

      //"/weatherforecast",
      //"/Identity"
   ],
    proxyTimeout: 100000,//încă un zero bm, așa se încarcă copacii și uzeru tot timpul
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
