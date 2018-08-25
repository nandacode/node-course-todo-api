const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {

    var newTodo = new Todo(req.body);

    newTodo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });

});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});

module.exports = {app};






















// var newTodo = new Todo({
//     text: 'Cook dinner'
// });

// newTodo.save().then((doc) => {
//     console.log('Saved data', doc);
// }, (e) => {
//     console.log('Unable to save data', e);
// });

// var newCompletedTodo = new Todo({
//     text: 'Eat dinner',
//     completed: true,
//     completedAt: 123456789
// });

// newCompletedTodo.save().then((doc) => {
//     console.log('Saved doc', doc);
// }, (e) => {
//     console.log('Unable to save doc', e);
// });

// var newTodo = new Todo({
//     text: " new todo "
// });

// newTodo.save().then((doc) => {
//     console.log('Saved doc', doc);
// }, (e) => {
//     console.log('Unable to save doc', e);
// });



// var newUser = new User({
//     email: 'nanda@nanda.com'
// });

// newUser.save().then((doc) => {
//     console.log('Saved user', doc);
// }, (e) => {
//     console.log('Unable to save doc', e);
// });
