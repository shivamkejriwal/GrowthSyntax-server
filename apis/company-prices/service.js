const moment = require('moment');
const _ = require('underscore');
const crud = require('./crud');

const config = require('../../config.js');
const util = require('../utils');
const analysis = require('./analysis');

const apiKey = config.quandl.api_key;


const sharadarUrl = 'https://www.quandl.com/api/v3/datatables/SHARADAR/SEP.json';

const errorHandler = (err, data) => {
    console.log('errorHandler', {err, data});
}


const successHandler = (result) => {
    console.log('successHandler');
    if (!result) return errorHandler('No Results.', result);
    if (!result.datatable) return errorHandler('No Datatable.', result);

    const dataList = result.datatable.data || [];
    const columnsList = result.datatable.columns || [];
    
    
    const resultsMap = {};
    console.log('successHandler-lists', {
        dataList: dataList.length,
        columnsList: columnsList.length
    });

    _.each(dataList, (payload, listIndex) => {
        const obj = {};
        _.each(payload, (item, index) => {
            const key = columnsList[index].name;
            const value = item;
            obj[key] = value;
        });
        resultsMap[obj.ticker] = obj;
    });
    analysis.doAnalysis(resultsMap, 10);
    const results = _.values(resultsMap);
    // console.log('results', results);
    crud.createBatch(results);
}
    
const callback = (err, res, body) => {
    if (err) {
        return errorHandler(err);
    }
    successHandler(body);
}


const getDay = () => {
    const day = moment().format('dddd');
    const hour = moment().hour();
    console.log('getDay', {day, hour});

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

const indicators = ['ticker', 'date', 'open', 'close', 'volume'];

const params = {
    'api_key': apiKey,
    'date': getDay(),
    'qopts.columns': indicators.toString()
};

console.log('params', params);
util.getData(sharadarUrl, params, callback);
       