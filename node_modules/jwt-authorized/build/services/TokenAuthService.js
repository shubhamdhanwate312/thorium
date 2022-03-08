"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class TokenAuthService {
  constructor({
    models,
    tokenConfig,
    events
  }) {
    this.models = models;
    this.tokenConfig = tokenConfig;
    this.events = events;
  }

  authenticateTokenStrategy({
    token
  }) {
    const {
      TokenUser
    } = this.models;
    const jsonPayload = this.verifyToken({
      token
    });

    if (!jsonPayload) {
      this.events.emit('TokenAuthService:authenticateTokenStrategy:fail', token);
      throw new Error('TokenAuthService:authenticateTokenStrategy() authentication fail', token);
    }

    const payload = JSON.parse(jsonPayload);

    if (!payload.exp || !payload.aud) {
      this.events.emit('TokenAuthService:authenticateTokenStrategy:fail token was malformed by server', token);
      throw new Error('TokenAuthService:authenticateTokenStrategy() authentication fail', token);
    }

    const {
      exp: expirationTime,
      aud: UUID
    } = payload;

    if (expirationTime <= this.tokenConfig.now()) {
      this.events.emit('TokenAuthService:authenticateTokenStrategy:fail expired token', token);
      throw new Error('TokenAuthService:authenticateTokenStrategy() authentication fail, please login again', token);
    }

    const tokenUser = new TokenUser({
      userInfo: {
        UUID
      },
      token
    });
    this.events.emit('TokenAuthService:authenticateTokenStrategy:success', tokenUser);
    return tokenUser;
  }

  verifyToken({
    token
  }) {
    const {
      engine,
      expiresIn,
      algorithm,
      keys
    } = this.tokenConfig;
    let secret = null;

    if (algorithm.charAt(0) === 'H' && typeof keys.privateKey === 'string') {
      secret = keys.privateKey;
    } else if (algorithm.charAt(0) === 'R' && typeof keys.publicKey === 'string') {
      secret = keys.publicKey;
    } else {
      if (!keys.privateKey && algorithm.charAt(0) === 'H' || !keys.publicKey) {
        throw new Error('TokenAuthService:verifyToken() bad configuration, need a keys.publicKey with RSA algorithm or keys.privateKey with HMAC', algorithm);
      }

      throw new Error('TokenAuthService:verifyToken() unsupported encryption algorithm', algorithm);
    }

    const tokenMatchesSecret = engine.verify(token, algorithm, secret);

    if (!tokenMatchesSecret) {
      this.events.emit('TokenAuthService:verifyToken:fail', token);
      return false;
    }

    const {
      payload
    } = engine.decode(token);
    this.events.emit('TokenAuthService:verifyToken:success', payload);
    return payload;
  }
  /**
   * IMPORTANT: If you are going to verify from a different server than the one who signs,
   * and that server is to be managed by someone else than the signing server,
   * then it makes sense to switch to RSA in order to withhold the signing
   * power within the signing server owners.
   */


  generateToken({
    user
  }) {
    const {
      engine,
      expiresIn,
      algorithm,
      keys
    } = this.tokenConfig;
    const secret = keys.privateKey;
    const secretOrPrivateKey = algorithm.charAt(0) === 'R' ? 'privateKey' : 'secret';
    const userID = user && (typeof user.UUID !== 'undefined' && user.UUID || typeof user.ID !== 'undefined' && user.ID || null);

    if (null === userID) {
      throw new Error('TokenAuthService:generateToken() Error: a param with prop { user } must have either a UUID or ID property', user);
    }

    const options = {
      header: {
        alg: algorithm
      },
      payload: {
        aud: userID,
        exp: expiresIn()
      },
      [secretOrPrivateKey]: secret
    };
    const token = engine.sign(options);
    this.events.emit('TokenAuthService:generateToken:success', token);
    return token;
  }

}

exports.default = TokenAuthService;