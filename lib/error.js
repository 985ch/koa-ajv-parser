'use strict';

class AjvParserError extends Error {
  constructor(name, message) {
    super(message + ':' + name);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AjvParserError;
