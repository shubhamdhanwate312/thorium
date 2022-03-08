"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _jws = _interopRequireDefault(require("jws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nHoursFromNow = n => {
  return _ => Math.floor(Date.now() / 1000) + n * (60 * 60);
};

function _default({
  expireTokensEveryNHours,
  algorithm,
  keys
}) {
  if (!algorithm || !keys.publicKey && !keys.privateKey) {
    console.log(algorithm, keys);
    throw new Error(`Bad configuration, not enough keys need RSA with either publicKey or privateKey, or HMAC with privateKey`);
  }

  return {
    engine: _jws.default,
    expiresIn: nHoursFromNow(expireTokensEveryNHours),
    now: nHoursFromNow(0),
    algorithm,
    keys
  };
}

;