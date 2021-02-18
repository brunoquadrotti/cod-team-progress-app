'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const CODAPI = require('call-of-duty-api')();
const app = require('express')();

admin.initializeApp();

// const dbUtils = require('./db-utils');

const db = admin.firestore().collection('matches');

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
  // console.log(JSON.stringify({
  //   Response: {
  //     Status: status,
  //     Body: body,
  //   },
  // }, null, 2));
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
            // console.log(`${method} Success Firebase Database =====>`, value.data);
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

app.get('/getPlayersStatus', async (req, res) => {

  if (req.method === 'PUT') {
    return res.status(403).send('Forbidden!');
  }

  // TODO: Obter de uma API esses dados
  const players = PLAYERS;
  
  return _baseRequest(req, res, 'MWwz', players.map(player => [player.gamertag, player.platform]));
});

app.get('/getFriendFeed', async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'friendFeed', [
    [player.gamertag, player.platform]
  ]);
});

app.get('/getPlayerStatus', async (req, res) => {

  const player = JSON.parse(req.query.player);

  return _baseRequest(req, res, 'MWwz', [
    [player.gamertag, player.platform]
  ]);
});

app.get('/getFuzzySearch', async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'FuzzySearch', [
    [player.gamertag, player.platform]
  ]);
});

app.get('/getMWcombatwz', async (req, res) => {

  const player = JSON.parse(req.query.player);
  
  return _baseRequest(req, res, 'MWcombatwz', [
    [player.gamertag, player.platform]
  ]);
});

app.get('/getMatches', (req, res) => {
  db.get()
    .then((docsMatches) => {
      const matches = [];

      docsMatches.forEach(match => {
        matches.push(match.data());
      });

      return res.json(matches);
    }).catch((err) => {
      console.error(err);
      res.status(500);
    });
});

app.get('/match', async (req, res) => {

  const matchID = req.query.matchID;

  try {
    const matchesQuery = await db.where('matchID', '==', matchID).get();
    const matches = [];
    matchesQuery.forEach((docMatch) => {
      matches.push(docMatch.data());
    });
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

const _getMatch = async (matchID) => {
  console.log('MEIO utils matchID: ', matchID);
  try {
    const matches = [];
    const matchesQuery = await db.where('matchID', '==', matchID).get();
    
    matchesQuery.forEach((docMatch) => {
      matches.push({
        id: docMatch.id,
        data: docMatch.data()
      });
    });

    // retorna somente o primeiro match
    return matches[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

const _createMatch = (matchID, data, isUpdate = false) => {
  return new Promise((resolve, reject) => {
    const docRef = db.doc(matchID);
    const method = isUpdate ? 'update' : 'set';

    return docRef[method](data).then((updateTime) => {
      console.log(`DB ${updateTime}: ${isUpdate ? 'Atualizei' : 'Criei'} o matchID: ${matchID}`);
      return resolve(updateTime);
    }, err => {
      reject(err);
    });
  });
};

let isRunningUpdateTeams = false;

app.get('/update-team-matches', async (req, res) => {
  const players = PLAYERS;

  if (isRunningUpdateTeams) {
    res.json({
      message: 'IN_PROGRESS',
      matches: []
    });
    return;
  }

  try {
    // Sempre executa o login antes de chamar algum método da API do CoD
    await _loginCoDAPI();

    const playersCombat = await Promise.all(players.map((player) => {
      return CODAPI.MWcombatwz(player.gamertag, player.platform);
    }));

    const matches = [];

    playersCombat.forEach((playerCombat) => {
      playerCombat.matches.forEach((match) => {
        const playerStats = match.playerStats;
        playerStats.username = match.player.username;
        const data = {
          utcStartSeconds: (match.utcStartSeconds * 1000),
          utcEndSeconds: (match.utcEndSeconds * 1000),
          mode: match.mode,
          matchID: match.matchID,
          teamPlacement: null,
          playersStats: [
            JSON.stringify(playerStats)
          ]
        };
        matches.push(data);
      });
    });

    let idx = 0;

    const addMatch = async () => {
      for (const match of matches) {
        const docRef = db.doc(match.matchID);
        const doc = await docRef.get();
        console.log(`O documento existe? ${doc.exists ? 'Sim' : 'Não'} - ${idx + 1} - ${Date.now()}`);

        const playerStats = match.playerStats;
        playerStats.username = match.player.username;

        if (doc.exists) {
          const data = doc.data();
          const isIncluded = data.playersStats.some((ps) => ps.username === match.player.username);

          if (!isIncluded) {
            data.playersStats.push(playerStats);
            await _createMatch(match.matchID, data, true);
          }
        } else {
          console.log('Vou criar o matchID: ', match.matchID);
          const data = {
            utcStartSeconds: (match.utcStartSeconds * 1000),
            utcEndSeconds: (match.utcEndSeconds * 1000),
            mode: match.mode,
            matchID: match.matchID,
            teamPlacement: null,
            playersStats: [
              JSON.stringify(playerStats)
            ]
          };
          await _createMatch(match.matchID, data);
        }

        idx++;

        if (!matches[idx]) {
          console.log(`TERMINEI`);
          isRunningUpdateTeams = false;
        }
      }
    };

    addMatch();
    isRunningUpdateTeams = true;

    /*
      const docRef = db.doc(match.matchID);
      const doc = await docRef.get();
      const playerStats = match.playerStats;
      playerStats.username = match.player.username;

      if (doc.exists) {
        console.log('Vou atualizar o matchID: ', match.matchID);
        const data = doc.data();
        // verificar se o usuário já existe antes de adicionar novamente
        data.playersStats.push(playerStats);
        await _createMatch(match.matchID, data, true);
      } else {
        console.log('Vou criar o matchID: ', match.matchID);
        const data = {
          utcStartSeconds: (match.utcStartSeconds * 1000),
          utcEndSeconds: (match.utcEndSeconds * 1000),
          mode: match.mode,
          matchID: match.matchID,
          teamPlacement: null,
          playersStats: [
            JSON.stringify(playerStats)
          ]
        };
        await _createMatch(match.matchID, data);
      }
    */

    // const match = await dbUtils.getMatch(matchID);
    // const hasMatch = !!match;
    // res.json(hasMatch);
    res.json({
      message: 'OK',
      matches: matches
    });
    
  }
  catch (err) {
    console.log(err);
    res.status(500);
  }
});

exports.api = functions.https.onRequest(app);