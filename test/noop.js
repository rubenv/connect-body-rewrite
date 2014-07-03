var assert = require('assert');
var express = require('express');
var rewrite = require('..');
var supertest = require('supertest');

describe('Noop', function () {
    var rewritten = false;

    var app = express();
    app.use(rewrite({
        accept: function () {
            return false;
        },
        rewrite: function (body) {
            rewritten = true;
            return body;
        }
    }));
    app.get('/noop', function (req, res) {
        res.json('OK');
    });

    app.get('/authneeded', function (req, res) {
        res.send(401, 'Auth needed!');
    });

    it('Should not touch non-matching files', function (done) {
        supertest(app)
            .get('/noop')
            .expect(200)
            .expect('"OK"')
            .end(function (err) {
                assert(!rewritten);
                done(err);
            });
    });

    it('Should not touch status when not accepting', function (done) {
        supertest(app)
            .get('/authneeded')
            .expect(401)
            .expect('Content-Type', /html/)
            .expect('Auth needed!')
            .end(function (err) {
                assert(!rewritten);
                done(err);
            });
    });
});
