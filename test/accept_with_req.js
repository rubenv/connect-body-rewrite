var assert = require('assert');
var express = require('express');
var rewrite = require('..');
var supertest = require('supertest');

describe('Accept with req', function () {
    var rewritten = false;

    var app = express();
    app.use(rewrite({
        accept: function (req, res) {
            var isHtml  = res.getHeader('content-type').match(/text\/html/);
            var needsUs = !!req.query['save-me'];
            return isHtml && needsUs;
        },
        rewrite: function (body) {
            rewritten = true;
            return body;
        }
    }));

    app.get('/html', function (req, res) {
        res.send(200, 'OK!');
    });

    it('should not accept based on request params', function (done) {
        supertest(app)
            .get('/html')
            .expect(200)
            .expect('OK!')
            .end(function (err) {
                assert(!rewritten);
                done(err);
            });
    });

    it('Should accept HTML with query base on request params', function (done) {
        supertest(app)
            .get('/html?save-me=please')
            .expect(200)
            .expect('Content-Type', /html/)
            .expect('OK!')
            .end(function (err) {
                assert(rewritten);
                done(err);
            });
    });
});
