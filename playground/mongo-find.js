const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongo server', err);
    }
    console.log('Successfully connected to db');

    var db = client.db('TodoApp');

    // db.collection('Todos').find({_id: new ObjectID('5b74fcf62e035740bc0e1831')}).toArray().then((docs) => {
    //     console.log('Todos collection');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch docs', err);
    // });

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos collection ${count}`);
    }, (err) => {
        console.log('Unable to fetch docs', err);
    });

    db.collection('Users').find({name: 'Nanda'}).toArray().then((docs) => {
        console.log('Users collection');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch docs', err);
    });
    client.close();

});