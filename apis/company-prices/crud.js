const _ = require('underscore');
const util = require('../utils');

const db = util.getFirebaseDB();
const collection = db.collection('Companies');
const Prices = 'Prices';

const getDocument = (ticker) => collection.doc(ticker);
                                        // .collection(Prices).doc('closing-price');

const fixData = (data) => {
    const keys = ['mostTraded', 'mostSold', 'mostBought'];
    _.each(keys, key => {
        data[key] = data[key] ? data[key] : false;
    });
}

let updateStock = (ticker, data) => {
    const document = getDocument(ticker);
    fixData(data);
    return document.update(data);
}

let createStock = (ticker, data) => {
    const document = getDocument(ticker);
    fixData(data);
    return document.set(data);
}

let readStock = (ticker) => {
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

let deleteStock = (ticker) => {
    const document = getDocument(ticker);
    return document.delete();
}

let getList = (count) => {
    // let limit = count ? count : 1;
    // const query = datastore.createQuery(kind)
    //     .limit(limit);
    // // TO DO: add better filters

    // return datastore.runQuery(query)
    //     .then((results) => {
    //         const entities = results[0];
    //         return entities;
    //     });
}


const sendBatch = (dataList) => {
    var batch = db.batch();
    
    _.each(dataList, (data) => {
        const doc = getDocument(data.ticker);
        fixData(data);
        batch.update(doc, data);
        // batch.set(doc, data);
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


// readStock('AAPL').then((result)=>{
//     console.log(result);
// });

module.exports = {
    create : createStock,
    read: readStock,
    update: updateStock,
    delete: deleteStock,
    list: getList,
    createBatch
};
