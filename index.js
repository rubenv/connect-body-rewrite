'use strict';

var buffers = {};

function rewriter(options, uid) {
    buffers[uid] = {};
    return function (req, res, next) {
        var writeHead = res.writeHead;
        var write = res.write;
        var end = res.end;

        function restore() {
            res.writeHead = writeHead;
            res.write = write;
            res.end = end;
        }

        function buffer(string, encoding) {
            if (!string) {
                return;
            }

            if (!res._rewriteId) {
                res._rewriteId = new Date().getTime() + '-' + Math.random();
            }

            if (!buffers[uid][res._rewriteId]) {
                buffers[uid][res._rewriteId] = [];
            }

            buffers[uid][res._rewriteId].push(string instanceof Buffer ? string.toString(encoding) : string);
        }

        res.writeHead = function () {};

        res.write = function (string, encoding) {
            if (!options.accept(res)) {
                restore(); 
                res.write(string, encoding);
                return;
            }

            buffer(string, encoding);
        };

        res.end = function (string, encoding) {
            buffer(string, encoding);
            restore();

            if (buffers[uid][res._rewriteId]) {
                string = buffers[uid][res._rewriteId].join('');
                delete buffers[uid][res._rewriteId];

                string = options.rewrite(string);

                res.setHeader('content-length', Buffer.byteLength(string, encoding));
            }

            res.end(string, encoding);
        };

        next();
    };
}

module.exports = function (options) {
    options = options || {};
    if (!options.accept) {
        options.accept = function () {
            return false;
        };
    }

    if (!options.rewrite) {
        options.rewrite = function (body) {
            return body;
        };
    }

    var uid = Math.random();
    return rewriter(options, uid);
};
