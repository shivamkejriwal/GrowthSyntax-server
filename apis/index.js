var stocksApi = require('./stocks/api');
var fundamentalsApi = require('./fundamentals/api');
var portfolioApi = require('./portfolios/api');
var watchlistApi = require('./watchlists/api');
var userProfilesApi = require('./user-profiles/api');
var companyProfilesApi = require('./company-profiles/api');

module.exports = {
    stocks : stocksApi,
    fundamentals: fundamentalsApi,
    portfolios : portfolioApi,
    watchlists : watchlistApi,
    userProfiles : userProfilesApi,
    companyProfiles : companyProfilesApi,
};
