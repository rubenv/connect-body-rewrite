# connect-body-rewrite - middleware to rewrite response bodies.

> Rewrite response bodies for some requests.

[![Build Status](https://travis-ci.org/rubenv/connect-body-rewrite.png?branch=master)](https://travis-ci.org/rubenv/connect-body-rewrite)

This plugin allows you to write middleware methods that process the response
body of a call.

## Usage

Add the module:

```bash
npm install connect-body-rewrite --save
```

Specify an accept function and a rewrite function:


```javascript
app.use(require('connect-body-rewrite')({
    accept: function (res) {
        return res.getHeader('content-type').match(/text\/html/);
    },
    rewrite: function (body) {
        return body.replace(/<\/body>/, "Copyright 2013 </body>");
    }
}));
```

The `accept` function should return a boolean to indicate whether or not this
request should be processed.

Used in:

* [connect-strip-manifest](https://github.com/rubenv/connect-strip-manifest)
* [connect-livereload-safe](https://github.com/rubenv/connect-livereload-safe)

## License 

    (The MIT License)

    Copyright (C) 2013 by Ruben Vermeersch <ruben@savanne.be>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
