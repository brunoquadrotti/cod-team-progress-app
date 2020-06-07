'use strict';

const functions = require('firebase-functions');
const moment = require('moment');
const cors = require('cors')({
  origin: true,
});
const API = require('call-of-duty-api')();

async function _getStatus(player) {
  return await API.MWwz(player.gamertag, player.platform);
}

async function _loginAPI() {
  return await API.login(
    functions.config().cod_api_credentials.email,
    functions.config().cod_api_credentials.password
  );
}

exports.getPlayerStatus = functions.https.onRequest(async (req, res) => {

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }

  const player = JSON.parse(req.query.player);

  const handleError = (error) => {
    console.error(error);
    return res.sendStatus(500);
  };

  const handleResponse = (status, body) => {
    console.log({
      Response: {
        Status: status,
        Body: body,
      },
    });
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };

  console.log('GETPLAYERSTATUS =====> INITIALIZED');

  try {
    return cors(req, res, async () => {

      const login = await _loginAPI().then((message) => {
        console.log('_loginAPI Success =====>', message);
        return message;
      }).catch((message) => {
        console.log('_loginAPI Error =====>', message);
        return message;
      });
  
      const status = await _getStatus(player).then((data) => {
        console.log('_getStatus Success =====>', data);
        return data;
      }).catch((message) => {
        console.log('_getStatus Error =====>', message);
        return message;
      });
  
      return handleResponse(200, status);
    });
  }
  catch (error) {
    return handleError(error);
  }
});

exports.getPlayersStatus = functions.https.onRequest(async (req, res) => {

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }

  const players = JSON.parse(req.query.players);

  console.log('PLAYER ====> ', req.query.players);

  const handleError = (error) => {
    console.error(error);
    return res.sendStatus(500);
  };

  const handleResponse = (status, body) => {
    console.log({
      Response: {
        Status: status,
        Body: body,
      },
    });
    if (body) {
      return res.status(200).json(body);
    }
    return res.sendStatus(status);
  };

  console.log('GETPLAYERSSTATUS =====> INITIALIZED');

  try {
    return cors(req, res, async () => {

      const login = await _loginAPI().then((message) => {
        console.log('_loginAPI Success =====>', message);
        return message;
      }).catch((message) => {
        console.log('_loginAPI Error =====>', message);
        return message;
      });

      const all = await Promise.all(players.map(player => _getStatus(player))).then((values) => {
        return values;
      });
  
      return handleResponse(200, all);
    });
  }
  catch (error) {
    return handleError(error);
  }
});
