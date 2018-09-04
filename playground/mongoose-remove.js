const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

Todo.findOneAndRemove({_id: '5b81459aae78ded4c7a4bbbe'}).then((doc) => {
    console.log('Removed document', doc);
});

Todo.findByIdAndRemove('5b814613ae78ded4c7a4bc10').then((doc) => {
    console.log('Removed doc by id',doc);
});