// Modulos

const express = require('express');
const request = require('request');
const redis = require("redis");

// Configurações

const app = express();
const port = 82;
const client = redis.createClient(); // é necessário instalar o Redis (https://redis.io/download) ou windows (https://github.com/dmajkic/redis/downloads)

// Rotas

app.get('/', (response) => {
  response.send('ok');
})

app.get(['/teste-1', '/test-1'], async (request, response) => { // Teste 1, sempre virá sem o Redis.
  let iDate = new Date().getTime();

  await getFromJSONPlaceholder('https://jsonplaceholder.typicode.com/comments').catch((er) => null)

  return response.send({ res: `demorou ${((new Date().getTime() - iDate))} milissegundos`})
})

app.get(['/teste-2', '/test-2'], async (request, response) => { // Teste 2, sempre virá com o Redis (quando possível).
  let iDate = new Date().getTime();

  await getFromJSONPlaceholder('https://jsonplaceholder.typicode.com/comments', true).catch((er) => null)

  return response.send({ res: `demorou ${((new Date().getTime() - iDate))} milissegundos`})
})

app.listen(port, () => {
  console.log('Veja a porta:', port);
})

// Funções

async function getFromJSONPlaceholder (url, redis = false) {
  return new Promise(async (resolve, reject) => {

    if (redis) {
      let fromReds = await getFromRedis(url).catch((er) => null)
      if (fromReds) {
        return resolve(JSON.parse(fromReds))
      }
    }

    const options = {
      url: url,
      headers: {
        'Cache-Control': 'no-cache'
      },
      json: true
    };

    request(options, (err, res, body) => {
      if (err) {
        return reject(null);
      }

      if (redis) {
        client.set(url, JSON.stringify(body))
      }

      return resolve(body);
    });
  })
}

async function getFromRedis(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, rply) => {
      if (err) {
        return reject(null) 
      }

      return resolve(rply)
    });
  })
}