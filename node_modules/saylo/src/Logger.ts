type LoggerOnOffMap = {
  log?: boolean;
  debug?: boolean;
  error?: boolean;
}

type LoggingFunction = (...args: any[]) => void;

export interface LoggerInterface {
  log: LoggingFunction;
  debug: LoggingFunction;
  error: LoggingFunction;
}

class Logger implements LoggerInterface {
  public log: LoggingFunction;
  public debug: LoggingFunction;
  public error: LoggingFunction;

  constructor(onOffMap?: LoggerOnOffMap) {
    this.log = onOffMap?.log ? this.turnOn('log') : this.turnOff('log');
    this.debug = onOffMap?.debug ? this.turnOn('debug') : this.turnOff('debug');
    this.error = onOffMap?.error ? this.turnOn('error') : this.turnOff('error');
  }

  turnOn(level?: keyof Logger) {
    const levels = level ? [level] : (['log', 'debug', 'error'] as (keyof Logger)[]);
    return this.turn(levels, console.log.bind(console));
  }

  turnOff(level?: keyof Logger) {
    const levels = level ? [level] : (['log', 'debug', 'error'] as (keyof Logger)[]);
    return this.turn(levels, () => undefined);
  }

  turn(levels: (keyof Logger)[], l: LoggingFunction) {
    levels.map(level => {
      if (level === 'log') {
        this.log = l;
      } else if (level === 'debug') {
        this.debug = l;
      } else if (level === 'error') {
        this.error = l;
      }
    });
    return l;
  }
}

export default Logger;
