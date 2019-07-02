'use strict';

const paser = require('./');

const middleware = paser({
  params: {
    id: { type: 'integer', minimum: 1 },
    name: 'string',
    phone: { type: 'string', default: '110' },
    ext: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
      required: [ 'id', 'name' ],
      optional: true,
    },
  },
});

async function test(info, body, query, params) {
  console.log(info);
  const ctx = {
    params,
    request: {
      body,
      query,
    },
    state: {},
  };
  try {
    await middleware(ctx, async () => {
      console.log(ctx.state.params);
    });
  } catch (e) {
    if (e.name === 'AjvPaserError') {
      console.log(e.message);
    }
  }
  console.log('complete!');
}

(async () => {
  await test('run test1', { id: '1', name: 'sachiko', ext: '{"id":1,"name":"sachiko","height":142}' }, {}, {});
  await test('run test2', {}, { id: '2', name: 'momoka', phone: '1234567' }, { id: '1' });
  await test('run test3', {}, {}, { id: '1', name: 'chie', ext: '{"id":3}' });
})();
