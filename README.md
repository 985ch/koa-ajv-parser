# koa-ajv-parser
![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/koa-ajv-parser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-ajv-parser
[download-image]: https://img.shields.io/npm/dm/koa-ajv-parser.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-ajv-parser

This module provides a middleware based on [ajv](https://github.com/epoberezkin/ajv) that validates the parameters of the http request and saves the result to ctx.state.params. The middleware will throw an error when the validation fails, so be sure to intercept and handle the errors thrown when using this middleware.

### [中文说明](./README.zh_CN.md)

## Install

```sh
npm i koa-ajv-parser
```
## Usage

```js
'use strict';

const ajvParser = require('koa-ajv-parser');

const rule = {
  params: { // root property, set all properties under it that do not contain default values and optional to be required
    id: { type: 'integer', minimum: 1 },
    name: 'string', // same as name:{ type:'string' }
    phone: { type: 'string', default: '110' },
    ext: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
      required: [ 'id', 'name' ],
      optional: true, // not required
    },
  },
  // getParams:(ctx, properties)=>{ return json;}
}

router.get('/yourpath',ajvParser(rule), routerHandler);
//http://yourpage/yourpath?id=2&name=sachiko&ext={%22id%22%3A1,%22name%22%3A%22momoka%22}
//ctx.state.params = {id:2, name:'sachiko', phone:'110', ext:{id:1, name:'momoka'}}
```
## Precautions
* Only under the params object, properties can be abbreviated in the form name: 'type'
* Only under the params object, perform JSON.parse on the parameters of type object and array and then verify
* Only under the params object, all properties are set to required by default unless the default value is set or optional: true
* By default, the corresponding values are obtained in the order of ctx.request.body, ctx.request.query, ctx.params, or you can change this rule by configuring the getParams function. See [getCtxParams](./index.js) for details.

## Test

```sh
npm test
```

## Author

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/koa-ajv-parser/blob/master/LICENSE) licensed.<br />
This README was translate by [google](https://translate.google.cn)
