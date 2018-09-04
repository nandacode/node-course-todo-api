const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

var text = "Test todo addition";
var todos = [
    {
        _id: new ObjectID(),
        "text": "test todo 1"
    },
    {
        _id: new ObjectID(),
        "text": "test todo 2",
        completed: true
    }
];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {

    it('should save todo note to collection', (done) => {
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });

    });

    it('should not create todo with bad request', (done) => {
        request(app)
            .post('\todos')
            .send({})
            .expect(400)
            .expect((res) => {
                // expect
            }).
            end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    
    it('should GET all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    
    it('should GET todo of the id passed', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if the id is invalid', (done) => {
        request(app)
            .get('/todos/1234')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    
    it('should return doc if removed', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {

    // it('should return the updated doc if id is valid', (done) => {

    //     var hexId = todos[0]._id.toHexString();
    //     var body = {completed: true};
    //     request(app)
    //         .patch(`/todos/${hexId}`)
    //         .send(body)
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body.todo.completed).toBe(body.completed);
    //         })
    //         .end((err, res) => {
    //             if(err){
    //                 return done(err);
    //             }

    //             Todo.findById(hexId).then((todo) => {
    //                 expect(todo.completed).toBe(body.completed);
    //                 expect(todo.completedAt).toBeTruthy();
    //             });
    //             done();
    //         });
    // });

    // it('should return 404 if id not found', (done) => {
    //     var hexId = new ObjectID().toHexString();
    //     request(app)
    //         .patch(`/todos/${hexId}`)
    //         .send({})
    //         .expect(404)
    //         .end(done);
    // });

    // it('should return 404 if id is invalid', (done) => {
    //     request(app)
    //         .patch('/todos/1231sdfa')
    //         .send({})
    //         .expect(404)
    //         .end(done);
    // });

    it('should update the todo', (done) => {

        var hexId = todos[0]._id.toHexString();
        var body = {
            completed: true,
            text: 'test todo 1 updated'
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(body.completed);
                expect(res.body.todo.completedAt).toBeA('number');
                expect(res.body.todo.text).toBe(body.text);
            })
            .end(done);
    });

    it('should clear completedAt if completed is false', (done) => {

        var hexId = todos[1]._id.toHexString();
        var body = {
            completed: false,
            text: 'test todo 2 updated'
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(body.completed);
                expect(res.body.todo.completedAt).toBeFalsy();
                expect(res.body.todo.text).toBe(body.text);
            })
            .end(done);
    });
});