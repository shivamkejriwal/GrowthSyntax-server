const _ = require('underscore');
const crud = require('../crud');
const stockCrud = require('../../stocks/crud');


let testWrite = () => {
    const user = 'shivam';
    const id = '123456';
    const data = {
        user,
        id,
        list: ['AAPL', 'GOOGL', 'VFC']
    };
    crud.create(user, id, data).then((result)=>{
        console.log(result);
    });

}

let testRead = () => {
    const user = 'shivam';
    const id = '123456';
    const data = {
        user,
        id,
        list: ['AAPL', 'GOOGL', 'VFC']
    };
    crud.read(user, id).then((result)=>{
        console.log(result);
    });

}

let testCollect = () => {
    const user = 'shivam';
    const id = '123456';
    const data = {
        user,
        id,
        list: ['AAPL', 'GOOGL', 'VFC']
    };
    crud.read(user, id)
    .then((result) => {
        console.log('testCollect-read',{
            result: result[0]
        });
        let requestChain = [];
        _.each(result[0].list,(ticker) => {
            console.log(`ticker:${ticker}`);
            requestChain.push(stockCrud.read(ticker));
        });
        return Promise.all(requestChain);
    })
    .then((results) => {
        console.log('testCollect-Success');
        _.each(results, (obj) => {
            console.log('ticker:',obj);
        });
    })
    .catch((err) => {
        console.log('testCollect-Error', err);
    });

}

testCollect();
