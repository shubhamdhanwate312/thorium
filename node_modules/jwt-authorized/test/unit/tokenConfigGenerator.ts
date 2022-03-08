import { expect } from 'chai';
import tokenConfigGenerator from '../../src/config/tokenConfigGenerator';

const nowEpochInSeconds = () => Math.floor((new Date()).getTime()/1000);

describe('tokenConfigGenerator', function() {

  describe(`tokenConfigGenerator({ expireTokensEveryNHours: 1})`, function() {

    it('should return an object with properties', async function() {
       expect(Object.keys(tokenConfigGenerator({ expireTokensEveryNHours: 1, algorithm: 'HS256', keys: { privateKey: 'secret' } }))).to.be.deep.equal([
        'engine',
        'expiresIn',
        'now',
        'algorithm',
        'keys',
      ]);
    });

  });

  describe(`tokenConfigGenerator({ expireTokensEveryNHours: 1}).expiresIn`, function() {

    it('should be a function', function() {
      const { expiresIn } = tokenConfigGenerator({ expireTokensEveryNHours: 1, algorithm: 'HS256', keys: { privateKey: 'secret' } });
      expect(expiresIn).to.be.a('function');
    });

  });

  describe(`tokenConfigGenerator({ expireTokensEveryNHours: 0.08}).expiresIn`, function() {

    it('should return an epoch in seconds 0.08 hours from now', function() {
      const { expiresIn } = tokenConfigGenerator({ expireTokensEveryNHours: 0.08, algorithm: 'HS256', keys: { privateKey: 'secret' } });
      const numSecondsIn1H1min = Math.floor(0.08 * 60 * 60);
      expect(expiresIn()).to.equal(nowEpochInSeconds() + numSecondsIn1H1min);
    });

  });

  describe(`tokenConfigGenerator({ expireTokensEveryNHours: 1}).expiresIn()`, function() {

    it('should return an number', function() {
      const { expiresIn } = tokenConfigGenerator({ expireTokensEveryNHours: 1, algorithm: 'HS256', keys: { privateKey: 'secret' } });
      expect(expiresIn()).to.be.a('number');
    });

    it('should return an epoch in seconds greater than now', function() {
      const { expiresIn } = tokenConfigGenerator({ expireTokensEveryNHours: 1, algorithm: 'HS256', keys: { privateKey: 'secret' } });
      expect(expiresIn()).to.be.above(nowEpochInSeconds());
    });

    it('should return an epoch in seconds smaller than 1 hour + 1 min from now', function() {
      const { expiresIn } = tokenConfigGenerator({ expireTokensEveryNHours: 1, algorithm: 'HS256', keys: { privateKey: 'secret' } });
      const numSecondsIn1H1min = 60 * 60 + 60;
      expect(expiresIn()).to.be.below(nowEpochInSeconds() + numSecondsIn1H1min);
    });

  });

});
