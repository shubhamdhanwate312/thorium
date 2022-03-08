"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class TokenUser {
  constructor({
    userInfo,
    token
  }) {
    Object.assign(this, userInfo);
    this.token = token;
  }

}

exports.default = TokenUser;