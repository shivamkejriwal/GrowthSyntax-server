
const _ = require('underscore');
const util = require('../utils');

const db = util.getFirebaseDB();
const collection = db.collection('company-profiles');

let getKey = (ticker) => {
    return ticker;
}

let updateCompanyProfiles = (ticker, data) => {
    // const entity = getEntity(ticker, data);
    // console.log('updateCompanyProfiles', entity);
    // return datastore.save(entity);
}

let createCompanyProfiles = (ticker, data) => {
    // return updateCompanyProfiles(ticker, data);
}

let readCompanyProfiles = (ticker) => {
    // const key = getKey(ticker);
    // return datastore.get(key);
}

let deleteCompanyProfiles = (ticker) => {
    // const key = getKey(ticker);
    // return datastore.delete(key);
}

let getList = (ticker, limit) => {
    // let query = datastore.createQuery(kind)
    //     .filter('ticker', '=', ticker);
    // if (limit) {
    //     query = query.limit(limit);
    // }

    // return datastore.runQuery(query)
    //     .then((results) => {
    //         const entities = results[0];
    //         return entities;
    //     });
}


const sendBatch = (dataList) => {
    var batch = db.batch();
    
    _.each(dataList, (profile) => {
        const doc = collection.doc(profile.ticker);
        batch.set(doc, profile);
    });
    return batch.commit().then(() => {
        console.log('Batch Complete');
    });
}

/*
 * Takes a list of data in the format
 * [{ticker, date, price}, {ticker, date, price}, ...]
 */
let createBatch = (dataList) => {
    
    console.log(`Created entities:${dataList.length}`);
    return new Promise((resolve, reject) => {
        let count = 0;
        let requestChain = [];
        while(dataList.length) {
            const batch = dataList.splice(0,500);
            requestChain.push(sendBatch(batch));
        }
        console.log(`Created requestChain:${requestChain.length}`);
        Promise.all(requestChain)
            .then((result) => {
                console.log('createBatch-Success');
                resolve(true);
            })
            .catch((err) => {
                console.log('createBatch-Error', err);
                reject(err);
            });
    });
}

module.exports = {
    create: createCompanyProfiles,
    read: readCompanyProfiles,
    update: updateCompanyProfiles,
    delete: deleteCompanyProfiles,
    list: getList,
    createBatch
};
