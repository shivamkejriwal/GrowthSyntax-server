const moment = require('moment');
const _ = require('underscore');
const crud = require('./crud');

const config = require('../../config.js');
const util = require('../utils');

const apiKey = config.quandl.api_key;


const url = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json';
const params = {
    date: moment().subtract(7, 'days').format('YYYYMMDD'),
    api_key: apiKey
};

let errorHandler = (err) => {
    return console.log(err);
}

let successHandler = (result) => {

    if (!result) return errorHandler('No EOD data');
    if (!result.datatable) return errorHandler('No EOD data');

    const columns = {};
    _.each(result.datatable.columns, (obj, index) => {
        const key = obj.name;
        columns[key] = index;
    });

    const data = _.map(result.datatable.data, (arr) => {
        const price = util.round(arr[columns.adj_close], 2);
        return {
            ticker: arr[columns.ticker],
            date: arr[columns.date],
            price
        }
    });
    console.log(`Found Stocks:${data.length}`);
    console.log('Stock Data[0]', data[0]);
    crud.createBatch(data);
}

let callback = (err, res, body) => {
    if (err) {
        return errorHandler(err);
    }
    successHandler(body);
}

let populateDays = (days) => {
    let requestChain = [];
    for( let i = 0 ; i < days; i++ ) {
        const batchParam = {
            date: moment().subtract(i, 'days').format('YYYYMMDD'),
            api_key: apiKey
        };
        console.log('Quandl params', batchParam);
        requestChain.push(util.getData(url, batchParam, callback));
    }
    Promise.all(requestChain)
        .then((result) => {
            console.log('populateDays-Success');
        })
        .catch((err) => {
            console.log('populateDays-Error', err);
        });
}

populateDays(1);
