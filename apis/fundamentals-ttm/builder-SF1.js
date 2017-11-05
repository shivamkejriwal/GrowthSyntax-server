const _ = require('underscore');
// const metrics = require('./metrics');

const config = require('../../config.js');
const util = require('../utils');
const apiKey = config.quandl.api_key;

const sf1Url = 'https://www.quandl.com/api/v3/datatables/SHARADAR/SF1';



const indicators = [
    'reportperiod',
    'ASSETTURNOVER',
    'GROSSMARGIN',
    'NETMARGIN',
    'PE',
    'PS',
    'PAYOUTRATIO',
    'ROIC',
    'ROA',
    'ROE',
    'ROS'
];

let errorHandler = (err, data) => {
    console.log('errorHandler', {err, data});
}

const getKey = (key) => {
    let result = key === 'reportperiod' ? 'DATE' : key;
    return result.toUpperCase();
}

let successHandler = (result, data, done) => {
    console.log('successHandler');

    if (!result) return errorHandler('No Results.', result);
    if (!result.datatable) return errorHandler('No Datatable.', result);

    let dates = data.dates;
    const dataList = result.datatable.data;
    const columnsList = result.datatable.columns

    console.log('successHandler-lists', {
        dataList: dataList.length,
        columnsList: columnsList.length
    }); 
    _.each(dataList, (itemList, listIndex) => {
        let valueMap = {};
        _.each(itemList, (item, index) => {
            const key = getKey(columnsList[index].name);
            const value = item;
            valueMap[key] = value;
        });
        const date = valueMap.DATE;
        data.dates.push(date);
        data[date] = valueMap;
        
    });
    // console.log('successHandler-data', data);
    done();
}

let build = (ticker, complete) => {
    let data = {
        ticker,
        dates : []
    };
    const dimension = 'ART';
    const params = {
        ticker,
        dimension,
        api_key: apiKey,
        'calendardate.gte': '2007-12-31',
        'qopts.columns': indicators.toString()
    };

    const successCallback = () => {
        // _.each(data.dates, (date) => {
        //     metrics.populate(data[date]);
        // });
        // console.log('Done', data);
        complete(data);
    };
    const dataCallback = (err, res, body) => {
        if (err) {
            errorHandler(err, body);
        } else {
            successHandler(body, data, successCallback);
        }
    };

    util.getData(sf1Url, params, dataCallback)
}

module.exports = {
    build
};