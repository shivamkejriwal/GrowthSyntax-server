const util = require('../utils');

const db = util.getFirebaseDB();
const collection = db.collection('Fundamentals');
const Annual = 'Annual';

const getDocument = (ticker, date) => collection.doc(ticker)
                                    .collection(Annual).doc(date);

let updateFundamentals = (ticker, date, data) => {
    const document = getDocument(ticker, date);
    return document.set(data);
}

let createFundamentals = (ticker, date, data) => {
    return updateFundamentals(ticker, date, data);
}

const getSingleYearData = (ticker, date) => {
    const document = getDocument(ticker, date);
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

const getAllAnnualData = (ticker) => {
    const col = collection.doc(ticker)
        .collection(Annual);
    return col.get()
        .then(snapshot => {
            let result = [];
            snapshot.forEach(doc => {
                result.push(doc.data());
            });
            return result;
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
}

let readFundamentals = (ticker, date) => {
    return (date)
        ? getSingleYearData(ticker, date)
        : getAllAnnualData(ticker);
}

let deleteFundamentals = (ticker, date) => {
    // const key = getKey(ticker, date);
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

module.exports = {
    create: createFundamentals,
    read: readFundamentals,
    update: updateFundamentals,
    delete: deleteFundamentals,
    list: getList
};
