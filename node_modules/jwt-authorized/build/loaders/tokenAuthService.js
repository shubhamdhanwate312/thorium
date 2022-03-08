"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("dotenv/config");

var _TokenAuthService = _interopRequireDefault(require("../services/TokenAuthService"));

var _models = require("../models");

var _tokenConfigGenerator = _interopRequireDefault(require("../config/tokenConfigGenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hoursBeforeExpire = process.env.JWT_HOURS_BEFORE_EXPIRE || 1;
const algorithm = process.env.JWT_ALGORITHM || 'HS256';
const privateKey = (process.env.JWT_KEY_PRIVATE || '').split('\\n').join("\n");
const publicKey = (process.env.JWT_KEY_PUBLIC || '').split('\\n').join("\n");
const keys = {};

if (algorithm.charAt(0) === 'H' && privateKey.length > 0) {
  keys.privateKey = privateKey;
}

if (algorithm.charAt(0) === 'R') {
  if (privateKey.length > 0) {
    keys.privateKey = privateKey;
  }

  if (publicKey.length > 0) {
    keys.publicKey = publicKey;
  }
}

var _default = {
  constructible: _TokenAuthService.default,
  deps: {
    models: {
      TokenUser: _models.TokenUser
    },
    tokenConfig: (0, _tokenConfigGenerator.default)({
      expireTokensEveryNHours: hoursBeforeExpire,
      algorithm,
      keys
    })
  },
  locateDeps: {
    events: 'events'
  }
};
exports.default = _default;