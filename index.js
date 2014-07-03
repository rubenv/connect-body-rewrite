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

        function sendHeaders() {
            if (buffers[uid][res._rewriteId]) {
                var data = buffers[uid][res._rewriteId];

                if (data.status) {
                    res.writeHead(data.status, data.headers);
                }
            }
        }

        function ensureBuffer() {
            if (!res._rewriteId) {
                res._rewriteId = new Date().getTime() + '-' + Math.random();
            }

            if (!buffers[uid][res._rewriteId]) {
                buffers[uid][res._rewriteId] = {
                    buffer: [],
                    status: null,
                    headers: null
                };
            }

            return buffers[uid][res._rewriteId];
        }

        function buffer(string, encoding) {
            if (!string) {
                return;
            }

            var data = ensureBuffer();
            data.buffer.push(string instanceof Buffer ? string.toString(encoding) : string);
        }

        function accept() {
            if (options.accept.length === 1) {
                return options.accept(res);
            } else {
                return options.accept(req, res);
            }
        }

        res.writeHead = function (status, headers) {
            var data = ensureBuffer();
            data.status = status;
            data.headers = headers;
        };

        res.write = function (string, encoding) {
            if (!accept()) {
                restore();
                sendHeaders();
                res.write(string, encoding);
                return;
            }

            buffer(string, encoding);
        };

        res.end = function (string, encoding) {
            buffer(string, encoding);
            restore();

            if (buffers[uid][res._rewriteId] && accept()) {
                string = buffers[uid][res._rewriteId].buffer.join('');
                string = options.rewrite(string);

                res.setHeader('content-length', Buffer.byteLength(string, encoding));
                sendHeaders();

                delete buffers[uid][res._rewriteId];
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
