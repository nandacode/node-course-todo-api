const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

const port = process.env.PORT || 3000;
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

app.get('/todos/:id', (req, res) => {
    var todoId = req.params.id;
    if(!ObjectID.isValid(todoId)){
        return res.status(404).send();
    }
    Todo.findById(todoId).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var todoId = req.params.id;
    if(!ObjectID.isValid(todoId)){
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(todoId).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.status(200).send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});

app.patch('/todos/:id', (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        return res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
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
