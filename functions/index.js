'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const CODAPI = require('call-of-duty-api')();

admin.initializeApp();

let lastLogin = 0;

// TODO: Obter de uma API esses dados
const PLAYERS = require('./players.json').players;

const _loginCoDAPI = async () => {
  const isLoginExpired = Date.now() - lastLogin > 1800000; // 30 minutos

  // Só faz o login novamente depois de 30 min do último login
  if (isLoginExpired) {
    return await CODAPI.login(
      functions.config().cod_api_credentials.email,
      functions.config().cod_api_credentials.password
    ).then((message) => {
      console.log('_loginCoDAPI Success =====>', message);
      lastLogin = Date.now();
      return message;
    }).catch((message) => {
      console.log('_loginCoDAPI Error =====>', message);
      lastLogin = null;
      return message;
    });       
  } else {
    return Promise.resolve();
  }
};

const _handleError = (res, error) => {
  console.error(error);
  return res.sendStatus(500);
};

const _handleResponse = (res, status, body) => {
  console.log(JSON.stringify({
    Response: {
      Status: status,
      Body: body,
    },
  }, null, 2));
  if (body) {
    return res.status(200).json(body);
  }
  return res.sendStatus(status);
};

const _getPathDatabase = (method, params) => {
  let path = `/${method}`;

  params.forEach(param => {
    if (typeof param === 'string') {
      path += `/${encodeURIComponent(param)}`;
    }
  });

  return path;
}

const _baseRequest = (req, res, method, listParams) => {

  if (req.method === 'PUT' || req.method === 'POST') {
    return res.status(403).send('Forbidden!');
  }

  try {
    return cors(req, res, async () => {

      let result = [];

      const promises = listParams.map(async (params) => {
        const path = _getPathDatabase(method, params);
        const snapshot = await admin.database().ref(`${path}`).once('value');

        // Antes de bater na API do CoD, é verificado se existe aqueles dados no database
        // e se ele ainda está valido (30 min).
        if (snapshot && snapshot.val()) {
          const value = snapshot.val();
          const isValidDate = Date.now() - value.lastUpdateDate < 1800000; // 30 minutos
          
          if (isValidDate) {
            console.log(`${method} Success Firebase Database =====>`, value.data);
            result.push(JSON.parse(value.data));
            return;
          }
        }

        // Sempre executa o login antes de chamar algum método da API do CoD
        await _loginCoDAPI();

        const response = await CODAPI[method](...params).then(async (data) => {

          // Sempre é armazenado os dados de retorno da API no Database
          // para ser usado numa próxima chamada por 30 minutos.
          await admin.database().ref(`${path}`).set({
            data: JSON.stringify(data),
            lastUpdateDate: Date.now()
          });

          console.log(`${method} Success API Call Of Duty =====>`, data);
          return data;
        }).catch((message) => {
          console.log(`${method} Error API Call Of Duty =====>`, message);
          return message;
        });
        
        result.push(response);
      });

      await Promise.all(promises);

      if (result.length === 1) {
        return _handleResponse(res, 200, result[0]);
      } else {
        return _handleResponse(res, 200, result);
      }
    });
  }
  catch (error) {
    return _handleError(res, error);
  }
}

exports.getPlayersStatus = functions.https.onRequest(async (req, res) => {

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }

  // TODO: Obter de uma API esses dados
  const players = PLAYERS;
  
  return _baseRequest(req, res, 'MWwz', players.map(player => [player.gamertag, player.platform]));
});

exports.getFriendFeed = functions.https.onRequest(async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'friendFeed', [
    [player.gamertag, player.platform]
  ]);
});

exports.getPlayerStatus = functions.https.onRequest(async (req, res) => {

  const player = JSON.parse(req.query.player);

  return _baseRequest(req, res, 'MWwz', [
    [player.gamertag, player.platform]
  ]);
});

exports.getFuzzySearch = functions.https.onRequest(async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'FuzzySearch', [
    [player.gamertag, player.platform]
  ]);
});

exports.getMWcombatwz = functions.https.onRequest(async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'MWcombatwz', [
    [player.gamertag, player.platform]
  ]);
});
