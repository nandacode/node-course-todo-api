const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017',{useNewUrlParser: true}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to mongo server', err);
    }
    console.log('Successfully connected to mongo server');

    var db = client.db('TodoApp');

    // db.collection('Todos').deleteMany({text: "eat breakfast"}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: "eat lunch"}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("Todos").findOneAndDelete({completed: true}).then((result) => {
    //     console.log(result);
    // });

    // db.collection("Users").deleteMany({name: "Nanda"}).then((result) => {
    //     console.log(result);
    // });

    db.collection("Users").findOneAndDelete({_id: new ObjectID("5b765b1dbf22cf6d15ec18e1")}).then((result) => {
        console.log(result);
    });

    // db.close(); since above operations would be interrupted.
});