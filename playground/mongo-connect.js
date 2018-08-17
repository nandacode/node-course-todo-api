// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');// Object destructuring

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongo server', err);
    }
    console.log('Connected to Mongo server');

    let db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do fast',
    //     completed: false    
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert document to Todos collection', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Nanda',
    //     age: 28,
    //     location: 'Chennai'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert document to Users collection', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });

    client.close();
});