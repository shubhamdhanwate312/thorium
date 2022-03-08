type Context = { [k: string]: any; }

export default class HeaderAuthTokenExtractor {
  static getAsyncContextReqMethod(context: Context) {
    return async function ({ req }: { req: { headers?: { authorization?: string; }; }; }): Promise<Context & { token?: string; }> {

      if (!req.headers || !req.headers.authorization) {
        return context;
      }

      const parts = req.headers.authorization.split(' ');

      if (parts.length !== 2 || !/^Bearer$/i.test(parts[0])) {
        throw new Error('credentials_bad_scheme message: Format is Authorization: Bearer [token]');
      } else {
        context.token = parts[1];
      }

      return context;
    };
  }
}