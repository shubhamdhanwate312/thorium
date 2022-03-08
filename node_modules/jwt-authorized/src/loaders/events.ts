import { LoadDictElement } from "di-why/build/src/DiContainer";
import Logger from "saylo";

export type EventsInterface = {
  emit: (...params: any[]) => void;
};

const events: LoadDictElement = {
  factory({ logger }: { logger: Logger }) {
    const events: EventsInterface = {
      emit(...params: any[]) {
        logger.log(params);
      },
    };
    return events;
  },
  locateDeps: {
    logger: 'logger',
  },
};

export default events;