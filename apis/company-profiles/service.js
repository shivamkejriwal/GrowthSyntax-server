const _ = require('underscore');
const crud = require('./crud');
const util = require('../utils');

const url = 'http://www.sharadar.com/meta/tickers.json'



let errorHandler = (err) => {
    return console.log(err);
}

let successHandler = (result, onComplete) => {
    const data = [];
    _.each(result, (company) => {
        if (!company['Delisted From']) {
            const profile = {
                name: company.Name,
                ticker: company.Ticker,
                location: company.Location,
                sector: company.Sector,
                industry: company.Industry
            }
            data.push(profile);
        }
    });
    onComplete(data);
}



let getData = (onComplete) => {
    let callback = (err, res, body) => {
        if (err) {
            return errorHandler(err);
        }
        successHandler(body, onComplete);
    }
    util.getData(url, {}, callback);
}


let saveToDatastore = (profiles) => {
    let requestChain = [];
    crud.createBatch(profiles);
};

getData((profiles) => {
    // const data = _.first(profiles, 2);
    // console.log(data);
    saveToDatastore(profiles);
});



