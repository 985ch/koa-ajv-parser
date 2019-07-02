'use strict';

const _ = require('lodash');
const Ajv = require('ajv');
const AjvParserError = require('./lib/error');

const ajv = new Ajv({ removeAdditional: true, coerceTypes: true, useDefaults: true });

function getSchema(params) {
  const properties = {};
  const required = [];
  for (const key in params) {
    let cur = params[key];
    if (_.isString(cur))cur = { type: cur };
    if (!cur.optional && !cur.default) {
      required.push(key);
    }
    properties[key] = cur;
  }
  return {
    type: 'object',
    properties,
    required,
  };
}

function getCtxParams(ctx, params) {
  let { body, query } = ctx.request;
  body = body || {};
  query = query || {};

  const obj = {};
  for (const key in params) {
    const data = body[key] || query[key] || ctx.params[key];
    const cur = params[key];
    if (_.isString(data) && (cur.type === 'object' || cur.type === 'array')) {
      try {
        obj[key] = JSON.parse(data);
      } catch (e) {
        throw new AjvParserError('.' + key, 'Invalid property value');
      }
    } else {
      obj[key] = data;
    }
  }
  return obj;
}

module.exports = options => {
  const schema = getSchema(options.params);
  const getParams = options.getParams || getCtxParams;
  const validate = ajv.compile(schema);
  return async (ctx, next) => {
    const params = getParams(ctx, schema.properties);
    const valid = validate(params);

    if (!valid) {
      const { dataPath, message } = validate.errors[0];
      throw new AjvParserError(dataPath, message);
    }
    ctx.state.params = params;

    await next();
  };
};
