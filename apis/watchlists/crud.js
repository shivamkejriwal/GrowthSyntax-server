const Datastore = require('@google-cloud/datastore');
const datastore = Datastore();

const kind = 'Watchlist';




let getKey = (user, id) => {
    const key = datastore.key([kind, `${user}_${id}`]);
    return key;
}


let getEntity = (user, id, data) => {
    let key = getKey(user, id);
    const entity = {
        key,
        data
    };
    return entity;
}



let updateWatchList = (user, id, data) => {
    const entity = getEntity(user, id, data);
    console.log('updateStock', entity);
    return datastore.save(entity);
}

let createWatchList = (user, id, data) => {
    return updateWatchList(user, id, data);
}


let readWatchList = (user, id) => {
    const key = getKey(user, id);
    return datastore.get(key);
}

let deleteWatchList = (user, id) => {
    const key = getKey(user, id);
    return datastore.delete(key);
}

let getList = (user) => {
    const query = datastore.createQuery(kind)
        .filter('user', '=', user);
    // TO DO: add better filters
    return datastore.runQuery(query)
        .then((results) => {
            const entities = results[0];
            return entities;
        });
}

module.exports = {
    create: createWatchList,
    read: readWatchList,
    update: updateWatchList,
    delete: deleteWatchList,
    list: getList
};
