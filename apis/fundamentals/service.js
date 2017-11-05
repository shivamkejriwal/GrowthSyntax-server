const moment = require('moment');
const _ = require('underscore');
const crud = require('./crud');
// const builder = require('./builder');
const builder = require('./builder-SF1');


const tickers = [
    'GOOGL',
    'VFC',
    'HBI',
    'LB',
    'PII',
    'ATVI',
    'SPG',
    'WFC',
    'V',
    'DIS',
    'MAT',
    'NKE'
];


let saveToDatastore = (data) => {
    const ticker = data.ticker;
    const dates = data.dates || [];
    let requestChain = [];

    _.each(dates, (date) => {
        data[date].ticker = ticker;
        data[date].date = date;
        requestChain.push(crud.create(ticker, date, data[date]));
    });
    Promise.all(requestChain)
        .then((result) => {
            console.log(`saveToDatastore(${ticker})-Success`, result);
        })
        .catch((err) => {
            console.log(`saveToDatastore(${ticker})-Error`, err);
        });
};

// builder.build('ATVI', (data) => {
//     console.log(data);
//     // saveToDatastore(data);
// });

_.each(tickers, (ticker) => {
    builder.build(ticker, (data) => {
        saveToDatastore(data);
    });
});

// crud.read('WMT', '2017-01-31')
// .then((result) => {
//     console.log('result',result);
// });

// crud.read('WMT')
//     .then((result) => {
//         console.log('result',result);
//     });

// crud.list('WMT').then((result) => {
//     console.log('result',result);
// });
