import Logger from 'saylo';
import { LoadDictElement } from 'di-why/build/src/DiContainer';

const loadDictElement: LoadDictElement = {
  constructible: Logger,
  deps: {
    log: true,
    debug: false
  },
};
export default loadDictElement;
