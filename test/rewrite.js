var assert = require('assert');
var express = require('express');
var rewrite = require('..');
var supertest = require('supertest');

describe('Rewrite', function () {
    var app = express();
    app.use(rewrite({
        accept: function () {
            return true;
        },
        rewrite: function (body) {
            assert.equal(body, 'Test');
            return 'Rewritten';
        }
    }));
    app.get('/', function (req, res) {
        res.send(200, 'Test');
    });
    app.get('/authneeded', function (req, res) {
        res.send(401, 'Test');
    });

    it('Should rewrite', function (done) {
        supertest(app)
            .get('/')
            .expect(200)
            .expect('Rewritten')
            .end(done);
    });

    it('Should preserve status', function (done) {
        supertest(app)
            .get('/authneeded')
            .expect(401)
            .end(done);
    });
});
