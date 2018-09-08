const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

var text = "Test todo addition";

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should save todo note to collection', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
                }).catch((e) => done(e));
            });

    });

    it('should not create todo with bad request', (done) => {
        request(app)
            .post('\todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    
    it('should return todo', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should not return todo created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
        });
        
        it('should return 404 if the id is invalid', (done) => {
            request(app)
            .get('/todos/1234')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    
    it('should remove todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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

    it('should not remove doc created by other user', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if id is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if id not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(body.completed);
                expect(typeof res.body.todo.completedAt).toBe('number');
                expect(res.body.todo.text).toBe(body.text);
            })
            .end(done);
    });

    it('should not update the todo created by other user', (done) => {

        var hexId = todos[0]._id.toHexString();
        var body = {
            completed: true,
            text: 'test todo 1 updated'
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .expect(404)
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
            .set('x-auth', users[1].tokens[0].token)
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

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create user', (done) => {
        var email = 'example@example.com';
        var password = 'password';
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBeTruthy();
            })
            .end((err) => {
                if(err){done(err);}

                User.findOne({email}).then((res) => {
                    expect(res.email).toBe(email);
                    expect(res.password).not.toBe(password);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('should return validation errors if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'asdfa@adfa',
                password:'pass'
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email already exists', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password:'password123'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findOne({
                    email: users[1].email
                }).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        'access': 'auth',
                        'token': res.header['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should reject if invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'dummy'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err) {
                    done(err);
                }

                User.findOne({
                    email: users[1].email
                }).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if(err){
                    done(err);
                }

                User.findOne({
                    email: users[0].email
                }).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});