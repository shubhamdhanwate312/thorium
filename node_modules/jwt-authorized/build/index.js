"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "loadThroughDi", {
  enumerable: true,
  get: function () {
    return _loaders.loadThroughDi;
  }
});
Object.defineProperty(exports, "tokenAuthService", {
  enumerable: true,
  get: function () {
    return _loaders.tokenAuthService;
  }
});
Object.defineProperty(exports, "TokenAuthService", {
  enumerable: true,
  get: function () {
    return _TokenAuthService.default;
  }
});
Object.defineProperty(exports, "HeaderAuthTokenExtractor", {
  enumerable: true,
  get: function () {
    return _HeaderAuthTokenExtractor.default;
  }
});
Object.defineProperty(exports, "TokenUser", {
  enumerable: true,
  get: function () {
    return _models.TokenUser;
  }
});
Object.defineProperty(exports, "tokenConfigGenerator", {
  enumerable: true,
  get: function () {
    return _tokenConfigGenerator.default;
  }
});
exports.default = void 0;

var _loaders = require("./loaders");

var _TokenAuthService = _interopRequireDefault(require("./services/TokenAuthService"));

var _HeaderAuthTokenExtractor = _interopRequireDefault(require("./services/HeaderAuthTokenExtractor"));

var _models = require("./models");

var _tokenConfigGenerator = _interopRequireDefault(require("./config/tokenConfigGenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _loaders.loadThroughDi;
exports.default = _default;