const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongo server', err);
    }
    console.log('Successfully connected to mongo server');

    var db = client.db('TodoApp');

    // db.collection("Todos").findOneAndUpdate({
    //     _id: new ObjectID("5b74fcf62e035740bc0e1831")
    // },{
    //     $set: {
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection("Users").findOneAndUpdate({
        _id: new ObjectID("5b765b08bf22cf6d15ec18cd")
    },{
        $set: {
            name: "Nanda"
        },
        $inc: {
            age: 1
        }
    },{
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })
});