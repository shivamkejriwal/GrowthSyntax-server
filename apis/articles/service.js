const request = require('request');
const moment = require('moment');
const _ = require('underscore');
const querystring = require('querystring');
const cheerio = require('cheerio');
const crud = require('./crud');

const config = require('../../config.js');
const apiKey = config.mercury.api_key;

const url = 'https://mercury.postlight.com/parser?';
const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
}


const getUrl = () => {
    const dateStr = moment().format('MM-D-YYYY');
    const params = {
        url: `http://investor.valueline.com/blog/stock-market-today-${dateStr}`
    };
    const qs = querystring.stringify(params);
    return `${url}${qs}`;
}

const htmlToString = (html) => {
    const $ = cheerio.load(html);
    const text = $.text();
    const noTrailingSpace = text.trim();
    const noExtraLines = noTrailingSpace.replace(/\n\n\n/g, '');
    return noExtraLines;
}

const callBack = (err, res, body)=> {
    const resultFound = Boolean(!err && body);
    const data = JSON.parse(body);
    if (resultFound && data && data.content) {
        const result = {
            title: htmlToString(data.title), 
            content: htmlToString(data.content), 
            excerpt: htmlToString(data.excerpt)
        }
        console.log(result);
    }   
}


const options = {
    headers,
    url: getUrl(),
    method: 'GET'
}
request(options, callBack);