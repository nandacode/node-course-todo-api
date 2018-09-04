const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b80d704af08ce3c4f47470d';

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos from db', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo from db', todo);
// });
// if(!ObjectID.isValid(id)){
//     return console.log('Id invalid');
// }
// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Find by Id', todo);
// }).catch((e) => {
//     console.log(e);
// });

User.findById('5b80b67306fc680c719ee5f4').then((user) => {
    if(!user){
        return console.log('User not available');
    }
    console.log('User found', user);
}).catch((e) => console.log(e));