
const _ = require('underscore');
const util = require('../utils');

const db = util.getFirebaseDB();
const collection = db.collection('Companies');
const Profile = 'Profile';

const getDocument = (ticker) => collection.doc(ticker)
                                        .collection(Profile).doc('Data');

let updateCompanyProfiles = (ticker, data) => {
    const document = getDocument(ticker);
    const doc = collection.doc(ticker);
    return doc.set({
                ticker, 
                name: data.name
            }).then(document.set(data));
}

let createCompanyProfiles = (ticker, data) => {
    return updateCompanyProfiles(ticker, data);
}

let readCompanyProfiles = (ticker) => {
    const document = getDocument(ticker);
    return document.get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                return doc.data();
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}

let deleteCompanyProfiles = (ticker) => {
    const document = getDocument(ticker);
    return document.delete();
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
        const ticker = profile.ticker;
        const name = profile.name;

        const rootDoc = collection.doc(ticker);
        const rootData = { ticker, name };
        const finalDoc = getDocument(ticker);

        batch.set(rootDoc, rootData);
        batch.set(finalDoc, profile);
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
            const batch = dataList.splice(0,250);
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
