const _ = require('underscore');
const crud = require('./crud');
const util = require('../utils');
const config = require('../../config.js');

const apiKey = config.quandl.api_key;
const sharadarMetaUrl = 'http://www.sharadar.com/meta/tickers.json'
const sharadarPricesUrl = 'https://www.quandl.com/api/v3/datatables/SHARADAR/SEP.json';


const errorHandler = (err) => console.log(err);

const successHandler = (result, onComplete) => {
    const data = {};
    _.each(result, (company) => {
        if (!company['Delisted From']) {
            const profile = {
                name: company.Name,
                ticker: company.Ticker,
                location: company.Location,
                sector: company.Sector,
                industry: company.Industry
            }
            data[profile.ticker] = profile;
        }
    });
    onComplete(data);
}


const getProfiles = (onComplete) => {
    return new Promise(( resolve, reject) => {
        util.getData(sharadarMetaUrl, {}, (err, res, body) => {
            if (err) {
                reject(err);
            }
            successHandler(body, resolve);
        });
    });
}


const saveToDatastore = (profiles) => crud.createBatch(profiles);

const testBatch = (profiles) => {
    const batch = profiles.splice(0,10);
    return crud.createBatch(batch); 
};

const getTickers = () => {
    const date = util.getLastMarketDay();
    const params = {
        'api_key': apiKey,
        'date': date,
        'qopts.columns': 'ticker'
    };

    return new Promise(( resolve, reject) => {
        util.getData(sharadarPricesUrl, params, (err, res, body) => {
            if (err) {
                reject(err);
            }
            const data = body && body.datatable
                        && body.datatable.data;
            const dataList = data || [];
            const tickers = _.map(dataList, ele => ele[0]);
            resolve(tickers);
        });
    });
}

const getCurrentProfiles = () => getTickers()
    .then(tickers => getProfiles()
        .then(profiles => {
            const data = [];
            _.each(tickers, ticker => data.push(profiles[ticker]));
            console.log(`Tickers: ${tickers.length}`);
            console.log(`Profiles: ${data.length}`);
            return data;
        }));

const getAllProfiles = () => getProfiles()
    .then(profiles => _.values(profiles));

// getAllProfiles().then(profiles => console.log(profiles[0])); 
getAllProfiles().then(profiles => saveToDatastore(profiles));