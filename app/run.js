// Modulos

const express = require('express');
const request = require('request');

// Configurações

const app = express();
const port = 82;

// Rotas

app.get('/', (response) => {
  response.send('ok');
})

app.get(['/teste-1', '/test-1'], async (request, response) => {
  let iDate = new Date().getTime();

  await getFromJSONPlaceholder('https://jsonplaceholder.typicode.com/comments').catch((er) => null)

  return response.send({ res: `demorou ${((new Date().getTime() - iDate))} milissegundos`})
})

app.listen(port, () => {
  console.log('Veja a porta:', port);
})

// Funções

async function getFromJSONPlaceholder (url) {
  return new Promise((resolve, reject) => {

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

      return resolve(body);
    });
  })
}