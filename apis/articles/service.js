const request = require('request');
const xml2json = require('xml2json');
const moment = require('moment');
const _ = require('underscore');
const querystring = require('querystring');
const cheerio = require('cheerio');
const crud = require('./crud');

const config = require('../../config.js');
const apiKey = config.mercury.api_key;

const mercuryUrl = 'https://mercury.postlight.com/parser?';
const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey
}


const getUrl = (uri) => {
    const dateStr = moment().format('MM-D-YYYY');
    const url = uri ? uri :  'http://investor.valueline.com/blog/stock-market-today-11-1-2017';//`http://investor.valueline.com/blog/stock-market-today-${dateStr}`;
    const params = { url };
    const qs = querystring.stringify(params);
    return `${mercuryUrl}${qs}`;
}

const htmlToString = (html) => {
    const $ = cheerio.load(html);
    const text = $.text();
    const noTrailingSpace = text.trim();
    const noExtraLines = noTrailingSpace.replace(/\n\n\n/g, '');
    return noExtraLines;
}

const extractHtml = (html) => {
    const $ = cheerio.load(html);
    const links = $('a');
    $(links).each(function(i, link){
        const href = $(link).attr('href');
        const text = $(link).text();
        $(link).removeAttr("href");
    });
    return $.html();
}

const callBack = (err, res, body)=> {
    const resultFound = Boolean(!err && body);
    const data = JSON.parse(body);
    if (resultFound && data && data.content) {
        const result = {
            title: htmlToString(data.title), 
            content: extractHtml(data.content),
            excerpt: htmlToString(data.excerpt)
        }
        // console.log(result);
    } else {
        console.log(body);
    }
}


// const options = {
//     headers,
//     url: getUrl(),
//     method: 'GET'
// }
// request(options, callBack);


const loadRssData = (item, done) => {
    const article = {
        title : item.title,
        url: item.link,
        category: item.category,
        date: moment(item.pubDate).format('DD-MM-YYYY'),
        author: 'valueline.com'
    };
    const options = {
        headers,
        url: getUrl(item.link),
        method: 'GET'
    };

    request(options, (err, res, body) => {
        if (!err) {
            const data = JSON.parse(body);
            article.content = extractHtml(data.content);
            // article.content = htmlToString(data.content);
            done(article);
        }
    });
}

request('http://investor.valueline.com/blog/rss.xml', (err, res, body) => {
    const data = xml2json.toJson(body);
    const json = JSON.parse(data);
    const rss = json.rss;
    const items = rss.channel.item;

    const articles = [];
    const done = (article) => {
        articles.push(article);
        if (articles.length >= items.length){
            console.log(`done: ${articles.length}`);
            crud.createBatch(articles);
        } 
    }

    _.each(items, (item) => loadRssData(item, done));    
});

const valueline = 'http://investor.valueline.com/blog/rss.xml';
const pimco = 'https://blog.pimco.com/en/feed';
const blackrock = 'https://www.blackrockblog.com/feed/';
const vanguard = 'https://vanguardblog.com/category/economy-markets/feed/';