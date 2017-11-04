const _ = require('underscore');
const util = require('../utils');

const db = util.getFirebaseDB();
const collection = db.collection('Users');

const getDocument = (userID) => collection.doc(userID);

const updateUserProfiles = (data) => {
    const document = getDocument(data.userID);
    return document.set(data);
};

const createUserProfiles = (data) => {
    return updateUserProfiles(data);
};

const deleteUserProfiles = (userID) => {
    const document = getDocument(userID);
    return document.delete();
};

const readUserProfiles = (userID) => {
    const document = getDocument(userID);
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
};

module.exports = {
    create: createUserProfiles,
    read: readUserProfiles,
    update: updateUserProfiles,
    delete: deleteUserProfiles
};
