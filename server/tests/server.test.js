const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../model/todo');

var text = "Test todo addition";

beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {

    it('should save todo note to collection', (done) => {
        request(app).
            post('/todos').
            send({text}).
            expect(200).
            expect((res) => {
                expect(res.body.text).toBe(text);
            }).
            end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });

    });

    it('should not create todo with bad request', (done) => {
        request(app).
            post('\todos').
            send({}).
            expect(400).
            expect((res) => {
                // expect
            }).
            end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});
