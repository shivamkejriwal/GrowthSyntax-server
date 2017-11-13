const request = require('request');
const moment = require('moment');
const querystring = require('querystring');
const config = require('../config.js');

// request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
//   if (err) { return console.log(err); }
//   console.log(body.url);
//   console.log(body.explanation);
// });

const round = (value, precision) => {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
}

let paramsToObj = (str) => {
    return querystring.parse(str);
}


let objToParams = (obj) => {
    return querystring.stringify(obj);
}


let getData = (url, params, cb) => {
    let query = objToParams(params);
    // console.log(`getData: ${url}?${query}`);
    request(`${url}?${query}`, { json: true }, cb);
}

const getLastMarketDay = () => {
    const day = moment().format('dddd');
    const hour = moment().hour();

    let diff = 0
    if (day === 'Sunday') {
        diff = 2;
    }
    else if (day === 'Saturday') {
        diff = 1;
    }
    else if (hour <= 14) {
        diff = 1;
    }
    return moment().subtract(diff, 'days').format('YYYY-MM-DD');
}

const getFirebaseDB = () => {
    const admin = require('firebase-admin');
    
    var serviceAccount = config.firebase.api_key;
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://growthsyntax.firebaseio.com"
    });
    
    var db = admin.firestore();
    return db;
}

module.exports = {
    round,
    getData,
    getLastMarketDay,
    getFirebaseDB
};
