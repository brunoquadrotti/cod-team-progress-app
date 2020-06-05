#!/usr/bin/env node

const fse = require('fs-extra');
const API = require('call-of-duty-api')();
const config = require('./config.json');
const platformsMap = {
    psn: API.platforms.psn,
    steam: API.platforms.steam,
    xbl: API.platforms.xbl,
    battle: API.platforms.battle,
    uno: API.platforms.uno
};

const showLog = (data, name) => {
    fse.outputFile(`${__dirname}/src/assets/json/${name}.json`, JSON.stringify(data, null, 2));
    // console.log(name, JSON.stringify({
    //     lifetime: {
    //         kills: data.lifetime.mode.br_all.properties.kills,
    //         deaths: data.lifetime.mode.br_all.properties.deaths,
    //         ratio: data.lifetime.mode.br_all.properties.kdRatio,
    //         damageDone: data.lifetime.mode.br_all.properties.damageDone,
    //         matchDamage: (data.lifetime.mode.br_all.properties.damageDone / data.lifetime.mode.br_all.properties.matchesPlayed),
    //         gamesPlayed: data.lifetime.mode.br_all.properties.gamesPlayed
    //     },
    //     weekly: {
    //         kills: data.weekly.mode.br_all.properties.kills,
    //         deaths: data.weekly.mode.br_all.properties.deaths,
    //         ratio: data.weekly.mode.br_all.properties.kdRatio,
    //         damageDone: data.weekly.mode.br_all.properties.damageDone,
    //         matchDamage: (data.weekly.mode.br_all.properties.damageDone / data.weekly.mode.br_all.properties.matchesPlayed),
    //         matchesPlayed: data.weekly.mode.br_all.properties.matchesPlayed
    //     },
    //     progress: {
    //         kills: getKillsProgress(data),
    //         deaths: getDeathsProgress(data),
    //         ratio: getRatioProgress(data)
    //     }
    // }, null, 2));
};

const getKillsProgress = (data) => {
    const A1 = data.weekly.mode.br_all.properties.kills / data.weekly.mode.br_all.properties.matchesPlayed;
    const B1 = data.lifetime.mode.br_all.properties.kills / data.lifetime.mode.br_all.properties.gamesPlayed;
    return ((A1 / B1) - 1) * 100;
};

const getDeathsProgress = (data) => {
    const A1 = data.weekly.mode.br_all.properties.deaths / data.weekly.mode.br_all.properties.matchesPlayed;
    const B1 = data.lifetime.mode.br_all.properties.deaths / data.lifetime.mode.br_all.properties.gamesPlayed;
    return ((A1 / B1) - 1) * 100;
};

const getRatioProgress = (data) => {
    const A1 = data.weekly.mode.br_all.properties.kdRatio;
    const B1 = data.lifetime.mode.br_all.properties.kdRatio;
    return ((A1 / B1) - 1) * 100;
};

const getByPlayerName = async (player, platform) => {
    return await API.MWwz(player, platform);
};

const getMWStatus = () => {
    config.players.forEach(async item => {
        return await getByPlayerName(item.player, platformsMap[item.platform]).then(data => {
            showLog(data, item.player);
        }).catch(err => {
            console.error(err);
        })
    });
};

API.login(config.email, config.password).then((message) => {
    console.log('success', message);
    getMWStatus();
}).catch((message) => {
    console.log('error', message);
});
