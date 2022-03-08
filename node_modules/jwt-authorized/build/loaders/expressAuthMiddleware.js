"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  instance: function (req, res, next) {
    if (!req.headers || !req.headers.authorization) {
      return next();
    }

    const parts = req.headers.authorization.split(' ');

    if (parts.length == 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        res.locals.token = credentials;
        return next();
      }
    }

    return next(new Error('credentials_bad_scheme', {
      message: 'Format is Authorization: Bearer [token]'
    }));
  },

  async after({
    me,
    serviceLocator
  }) {
    const app = await serviceLocator.get('app');
    app.use(me);
  }

};
exports.default = _default;