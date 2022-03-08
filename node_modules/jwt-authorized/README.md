![code coverage](https://img.shields.io/codecov/c/github/gbili/jwt-authorized.svg)
![version](https://img.shields.io/npm/v/jwt-authorized.svg)
![downloads](https://img.shields.io/npm/dm/jwt-authorized.svg)
![license](https://img.shields.io/npm/l/jwt-authorized.svg)

# Auth JWT

Use Json Web Tokens to authorize requests via `Authorization: Bearer <your-token>`

## Usage

**IMPORTANT**: add the private key to your env, if you are using `HS256` (default)
```javascript
process.env.JWT_KEY_PRIVATE = 'mysecret key'
```
**IMPORTANT**: add the private plus public keys to your .env, if you are using `RS256`
```javascript
process.env.JWT_KEY_PUBLIC = 'some generated public key'
process.env.JWT_KEY_PIRVATE = 'some generated private key'
```
**IMPORTANT**: if you are using RS256, you need to generate private public key pairs. If you are using mac it is done with the following command (in your project's root dir):

```bash
ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key
# Don't add passphrase
openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Once the keys have been generated, you will need to `.gitignore` them. To do so, add a line to `.gitignore` with `*RS256.key*`.

You then need to add the private key to your `.env` file under the key: `JWT_KEY_PRIVATE`. Since the key is in multiple lines in `jwtRSA256.key`, you will need to make it a single line by adding a `\n` at the end of each line, and then assembling the lines in a single line. With a vim macro you can achieve this easily:

1. Copy the `jwtRSA256.key` key and paste it as is, **at the end** of your `.env`
2. Then go to the first line of your key (where it says `------ BEGIN RSA PRIVATE KEY ------`, this is part of the key do not remove it) and record this macro by typing `qa$Jxi\n` then `^C` (`ctrl+c`), finally type `q` (dont move your cursor for next step).
3. With the recorded macro under register `a` we simply type `100q@a` and see the magic operate.


### Header Authorization Token Extractor
If you are using apollo, you might want to insert the `token` authorization into `context`. This can be acheived like so:
```javascript
import HeaderAuthTokenExtractor from 'jwt-authorized';
import templateStatusMessages from '../config/templateStatusMessages';

// some context that you want
const context = {
  authService: await serviceLocator.get('authService'),
  templateStatusMessages,
};

ApolloServer({
  //...
  context: HeaderAuthTokenExtractor.getAsyncContextReqMethod(context)
});
```

### TokenAuthService

First of all you need to load it somehow, either:
Use `di-why` dependency injection
```javascript
import { TokenAuthService, TokenUser, tokenConfigGenerator } from 'jwt-authorized';

export default {
  constructible: TokenAuthService,
  deps: {
    models: {
      TokenUser
    },
    tokenConfig: tokenConfigGenerator({ expireTokensEveryNHours: 1 }),
  },
  locateDeps: {
    events : 'events',
  },
};
```
Or alternatively do it manually:
```javascript
import { TokenAuthService, TokenUser, tokenConfigGenerator } from 'jwt-authorized';
//import events from ...

const tokenAuthService = TokenAuthService({
  models: {
    TokenUser,
  },
  tokenConfig: tokenConfigGenerator({ expireTokensEveryNHours: 1 }),
  events,
};
```

Once it is loaded, you can authorize requests from **within** apollo resolvers:
```javascript
//within a resolver get the token from the context
const { token, tokenAuthService } = context;
const tokenPayload = tokenAuthService.verifyToken({token})
if (!tokenPayload) {
  throw new Errr('Hey you are not legit!');
}
// or
const { token, tokenAuthService } = context;
const tokenUser = tokenAuthService.authenticateTokenStrategy({token})
```
