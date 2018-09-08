const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'nanda@example.com',
    password: 'userPassOne',
    tokens:[{
        access: 'auth',
        token: jwt.sign({_id: userOneId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
},
{
    _id: userTwoId,
    email: 'kumar@example.com',
    password: 'userPassTwo',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId.toHexString(), access: 'auth'}, process.env.JWT_SECRET)
    }]
}];

const todos = [
    {
        _id: new ObjectID(),
        "text": "test todo 1",
        _creator: userOneId
    },
    {
        _id: new ObjectID(),
        "text": "test todo 2",
        completed: true,
        _creator: userTwoId
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done()).catch((e) => done(e));;
};

module.exports = {todos, populateTodos, users, populateUsers};