import { LoadDictElement } from "di-why/build/src/DiContainer";

const loadDictElement: LoadDictElement = {
  instance: function(req: { headers: { authorization: string; }; }, res: { locals: { token: any; }; }, next: (arg0?: Error) => any) {
    if (!req.headers || !req.headers.authorization) {
      return next();
    }

    const parts = req.headers.authorization.split(' ');

    if (parts.length == 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        res.locals.token = credentials
        return next();
      }
    }

    const messageDetail = { message: 'Format is Authorization: Bearer [token]' };
    return next(new Error(`credentials_bad_scheme: ${messageDetail}`));
  },
  async after({ me, serviceLocator }) {
    const app = await serviceLocator.get('app');
    app.use(me);
  },
};
export default loadDictElement;