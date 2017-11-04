const moment = require('moment');
const _ = require('underscore');
const crud = require('./crud');


const Users = [
    {
        first: 'Shivam',
        last: 'Kejriwal',
        userID: '000',
        watchlist: ['GOOGL', 'VFC', 'HBI', 'LB', 'PII', 'ATVI', 'SPG', 'WFC', 'V', 'DIS', 'MAT', 'NKE']
    },
    {
        first: 'Warren',
        last: 'Buffett',
        userID: '111',
        watchlist: ['IBM', 'AAPL', 'DAL', 'WMT']
    },
    {
        first: 'Peter',
        last: 'Lynch',
        userID: '222',
        watchlist: ['GM', 'F', 'KR', 'WSM', 'EW']
    },
    {
        first: 'Philip',
        last: 'Fisher',
        userID: '333',
        watchlist: ['NFLX', 'TSLA', 'CVS', 'MSFT']
    }
];


let saveToDatastore = (data) => {
    crud.create(data);
};

Users.forEach(user => {
    saveToDatastore(user);
})
