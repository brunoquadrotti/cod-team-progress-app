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

if (!config.email || !config.password) {
    throw new Error('Please enter an email and password login.');
}

if (!config.players || !config.players.length) {
    throw new Error('Please entervalid players.');
}

const generateJsonFile = (data, name) => {
    fse.outputFile(`${__dirname}/src/assets/json/${name}.json`, JSON.stringify(data, null, 2));
};

const getStatus = async (player, platform) => {
    return await API.MWwz(player, platform);
};

const getMWStatus = () => {
    config.players.forEach(async item => {
        return await getStatus(item.player, platformsMap[item.platform]).then(data => {
            generateJsonFile(data, item.player);
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
