var assert = require('assert');
var express = require('express');
var rewrite = require('..');
var supertest = require('supertest');

describe('Accept', function () {
    var rewritten = false;

    var app = express();
    app.use(rewrite({
        accept: function (res) {
            return res.getHeader('content-type').match(/text\/html/);
        },
        rewrite: function (body) {
            rewritten = true;
            return body;
        }
    }));
    app.get('/json', function (req, res) {
        res.json('OK');
    });

    app.get('/html', function (req, res) {
        res.send(401, 'Auth needed!');
    });

    it('Should not accept JSON', function (done) {
        supertest(app)
            .get('/json')
            .expect(200)
            .expect('"OK"')
            .end(function (err) {
                assert(!rewritten);
                done(err);
            });
    });

    it('Should accept HTML', function (done) {
        supertest(app)
            .get('/html')
            .expect(401)
            .expect('Content-Type', /html/)
            .expect('Auth needed!')
            .end(function (err) {
                assert(rewritten);
                done(err);
            });
    });
});
