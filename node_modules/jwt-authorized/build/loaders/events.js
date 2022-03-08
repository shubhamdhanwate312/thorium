"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  factory({
    logger
  }) {
    const events = {
      emit(...params) {
        logger.log(params);
      }

    };
    return events;
  },

  locateDeps: {
    logger: 'logger'
  }
};
exports.default = _default;