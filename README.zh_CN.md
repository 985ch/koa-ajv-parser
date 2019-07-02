# koa-ajv-parser
![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/koa-ajv-parser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-ajv-parser
[download-image]: https://img.shields.io/npm/dm/koa-ajv-parser.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-ajv-parser

该模块提供了一个基于[ajv](https://github.com/epoberezkin/ajv)的中间件，用于验证http请求的参数并将验证后的结果保存到ctx.state.params中。在验证失败时中间件会抛出一个错误，在使用本中间件时请确保能对其抛出的错误进行拦截和处理。

## 需求

- node &gt;=8

## 安装

```sh
npm i koa-ajv-parser
```
## 使用方法

```js
'use strict';

const ajvParser = require('koa-ajv-parser');

const rule = {
  params: { // params下所有属性默认都是必须的，除非设置了默认值或者optional为true
    id: { type: 'integer', minimum: 1 },
    name: 'string', // 这种写法仅能用在params下，等同于name:{ type:'string' }
    phone: { type: 'string', default: '110' },
    ext: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
      required: [ 'id', 'name' ],
      optional: true, // 该参数仅在params下有效
    },
  },
  // getParams:(ctx, properties)=>{ return json;}
}

router.get('/yourpath',ajvParser(rule), routerHandler);
//http://yourpage/yourpath?id=2&name=sachiko&ext={%22id%22%3A1,%22name%22%3A%22momoka%22}
//ctx.state.params = {id:2, name:'sachiko', phone:'110', ext:{id:1, name:'momoka'}}
```
## 注意事项
* 仅在params对象下，属性可以用name:'type'的形式简写
* 仅在params对象下，会对type为object和array的参数执行JSON.parse之后再验证
* 仅在params对象下，所有属性默认都会设为required，除非设置了默认值或者optional:true
* 默认情况下会按ctx.request.body,ctx.request.query,ctx.params的顺序获取对应的值，也可以通过配置getParams函数改变这个规则。详见[getCtxParams](./index.js)

## 执行测试脚本

```sh
npm test
```

## 作者

 **985ch**

* Github: [@985ch](https://github.com/985ch)

## License

Copyright © 2019 [985ch](https://github.com/985ch).<br />
This project is [MIT](https://github.com/985ch/koa-ajv-parser/blob/master/LICENSE) licensed.