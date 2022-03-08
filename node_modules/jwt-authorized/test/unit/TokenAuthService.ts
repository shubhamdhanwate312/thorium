import 'dotenv/config';
import chai from 'chai';
import { expect } from 'chai';
import { logger } from 'saylo';
import DiContainer from 'di-why';
import chaiAsPromised from 'chai-as-promised';
import TokenAuthService from '../../src/services/TokenAuthService.js';
import loadThroughDi from '../../src/loaders';

chai.use(chaiAsPromised);

logger.turnOn('debug');

const events = {
  emit(...params: any[]) {
    logger.log(params);
  },
};


describe(`auth-jwt`, function() {

  describe(`loadThroughDi()`, function() {
    it('should load', async function() {
      const injectionDict = { events: { instance: events }, logger: { instance: logger }};
      const di = new DiContainer({ logger, load: injectionDict });
      expect(await di.get('logger')).to.be.equal(logger);

      loadThroughDi({ di });

      expect(await di.get('tokenAuthService')).to.be.an.instanceof(TokenAuthService);
    });
  });

});
