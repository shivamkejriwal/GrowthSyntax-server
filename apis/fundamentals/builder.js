const _ = require('underscore');
const metrics = require('./metrics');

const config = require('../../config.js');
const util = require('../utils');
const apiKey = config.quandl.api_key;

// dimensions : ARY,ARQ,ART,MRY,MRQ,MRT
const sfoUrl = 'https://www.quandl.com/api/v3/datasets/SF0';
const eodUrl = 'https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json';


const indicators = [
    'PE', // Price Earnings // ===
    'PB', // Price to Book Value // ===
    'REVENUE',
    'NETINC', // Net Income
    'ROE', // Return on Average Equity // ===
    'ROA', // Return on Average Assets // ===
    'DEBT',
    'DEBTC',
    'DEBTNC',
    'ASSETS',
    'LIABILITIES',
    'DIVYIELD', // ===
    'PAYOUTRATIO', // ===
    'DE' // Debt to Equity Ratio
];

const rawIndicators = [
    'SHARESWA', // Weighted Average Shares
    'NETINC', // Net Income
    'REVENUE',
    'COR', // Cost of Revenue
    'GP', // Gross Profit
    'ASSETS',
    'ASSETSC',
    'ASSETSNC',
    'LIABILITIES',
    'LIABILITIESC',
    'LIABILITIESNC',
    'RECEIVABLES',
    'PAYABLES',
    'CASHNEQ',
    'WORKINGCAPITAL',
    'DEPAMOR', // Depreciation, Amortization & Accretion
    'NCFI', // Net Cash Flow from Investing
    'NCFO', // Net Cash Flow from Operations
    'NCFF', // Net Cash Flow from Financing
    'NCFDEBT', // Issuance (Repayment) of Debt Securities
    'INVCAP', // Invested Capital
    'CAPEX', // Capital Expenditure
    'DEBT', // Total Debt
    'EQUITY', // Shareholders Equity
    'FCF', // Free Cash Flow
    'FCFPS', // Free Cash Flow per Share
    'EPS', // Earnings per Basic Share
    'DPS', // Dividends per Basic Common Share
    'BVPS', // Book Value per Share
    'DE', // Debt to Equity Ratio
    'CURRENTRATIO', // Current Ratio
    'DILUTIONRATIO', // Share Dilution Ratio
    'RND' // Research and Development Expense
];

let getFundamentalsUrl = (ticker, indicator, dimension) => {
    const url  = `${sfoUrl}/${ticker}_${indicator}_${dimension}.json`;
    return url;
}

let errorHandler = (err) => {
    console.log('errorHandler', err);
}

let successHandler = (result, data, done) => {
    // console.log('successHandler');

    if (!result) return errorHandler('No data');
    if (!result.dataset) return errorHandler('No data');

    let dates = data.dates;
    const dataset = result.dataset.data;
    const dataset_code = result.dataset.dataset_code;
    const indicator = dataset_code.split('_')[1];

    _.each(dataset, (obj) => {
        const date = obj[0];
        const value = obj[1];
        if (dataset.length !== dates.length
            && !_.contains(dates, date)) {
            dates.push(date);
        }
        data[date] = data[date] || {};
        data[date][indicator] = value;
    });

    data.indicatorsDone = data.indicatorsDone + 1;
    if (data.indicatorsDone >= data.indicatorsExpected) {
        done();
    }
}

let fillEodData = (data, done) => {
    const ticker = data.ticker;
    const dates = data.dates;
    let callbacksTriggered = 0;

    const callback = (err, res, body) => {
        callbacksTriggered = callbacksTriggered + 1;
        const payload = body
                    && body.datatable
                    && body.datatable.data
                    && body.datatable.data[0] || [];

        if (payload.length > 0) {
            const date = payload[0];
            const value = payload[1];
            if (data[date]) {
                data[date]['PRICE'] = value;
            }
        }

        if (callbacksTriggered >= dates.length) {
            done();
        }
    };

    _.each(dates, (date) => {
        const params = {
            ticker,
            date : date.replace(/-/g, ''),
            'qopts.columns' : 'date,adj_close',
            api_key : apiKey
        };
        util.getData(eodUrl, params, callback);
    });
}

let build = (ticker, complete) => {
    let data = {
        ticker,
        indicatorsDone : 0,
        indicatorsExpected : rawIndicators.length,
        dates : []
    };
    const dimension = 'MRY';
    const params = {api_key: apiKey};

    const successCallback = () => {
        _.each(data.dates, (date) => {
            metrics.populate(data[date]);
        });
        // console.log('Done', data);
        delete data.indicatorsDone;
        delete data.indicatorsExpected
        complete(data);
    };
    const fundamentalsCallback = () => fillEodData(data, successCallback);
    const dataCallback = (err, res, body) => {
        if (err) {
            errorHandler(err);
        } else {
            successHandler(body, data, fundamentalsCallback);
        }
    };

    _.each(rawIndicators, (indicator) => {
        const url = getFundamentalsUrl(ticker, indicator, dimension);
        util.getData(url, params, dataCallback)
    });
}

module.exports = {
    build
};


// Relative to peers (Induustry, Sector)

// Health
    // Debt
    // Dividend stability
// Valuation
    // PE
    // PB
    // PEG
// Moat
    // Protection of profits
    // ROIC
// Performance
    // ROE
    // ROA
    // ROEA
    // ROIC
// Growth
    // Dividend
// Management
    // Decrease in number of outstanding shares over time
    // When you buy shares
